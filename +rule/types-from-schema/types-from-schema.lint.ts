import * as Effect from "effect/Effect"
import * as Match from "effect/Match"
import { Rule, RuleContext } from "effect-oxlint"
import * as RuleModule from "../../tools/lint/rule-module.make.ts"
import { isGoverned } from "../../tools/lint/kinds.pure.ts"

const exempt = /\.(schema|test|test-d|d)\.ts$/

const isFunctionMember = (member: any) =>
  member.type === "TSMethodSignature" ||
  member.type === "TSCallSignatureDeclaration" ||
  member.typeAnnotation?.typeAnnotation?.type === "TSFunctionType"

const builtins = new Set(["Readonly", "ReadonlyArray", "Array", "Record", "Partial"])

const isTypeLevel = (type: any): boolean =>
  Match.value(type?.type).pipe(
    Match.when("TSTypeReference", () =>
      Match.value((type.typeArguments?.params ?? []).length > 0).pipe(
        Match.when(true, () => !builtins.has(type.typeName?.name ?? "") || type.typeArguments.params.some(isTypeLevel)),
        Match.orElse(() => false)
      )
    ),
    Match.when("TSArrayType", () => isTypeLevel(type.elementType)),
    Match.when("TSUnionType", () => type.types.some(isTypeLevel)),
    Match.when("TSTypeOperator", () => isTypeLevel(type.typeAnnotation)),
    Match.whenOr("TSIndexedAccessType", "TSTypeQuery", "TSConditionalType", "TSMappedType", () => true),
    Match.orElse(() => false)
  )

const isTypeLevelMember = (member: any) =>
  member.computed === true || isTypeLevel(member.typeAnnotation?.typeAnnotation)

const isDataShape = (members: ReadonlyArray<any>) =>
  members.length > 0 && !members.some(isFunctionMember) && !members.some(isTypeLevelMember)

const message =
  "Data shapes are Schemas: declare a Schema in a *.schema.ts and use `typeof X.Type`. See +rule/types-from-schema/types-from-schema.md."

export default RuleModule.make(import.meta.url, {
  "no-plain-shapes": Rule.define({
    name: "no-plain-shapes",
    meta: Rule.meta({
      type: "problem",
      description: "Object types are derived from Schemas. See +rule/types-from-schema/types-from-schema.md."
    }),
    create: function* () {
      const ctx = yield* RuleContext
      const governed = isGoverned({ path: ctx.filename }) && !exempt.test(ctx.filename)
      const check = (node: any, members: ReadonlyArray<any>) =>
        Match.value(governed && !node.typeParameters && isDataShape(members)).pipe(
          Match.when(true, () => RuleModule.report(node, message)),
          Match.orElse(() => Effect.void)
        )
      return {
        TSInterfaceDeclaration: (node: any) =>
          Match.value((node.extends ?? []).length > 0).pipe(
            Match.when(true, () => Effect.void),
            Match.orElse(() => check(node, node.body?.body ?? []))
          ),
        TSTypeAliasDeclaration: (node: any) =>
          Match.value(node.typeAnnotation?.type).pipe(
            Match.when("TSTypeLiteral", () => check(node, node.typeAnnotation.members ?? [])),
            Match.orElse(() => Effect.void)
          )
      }
    }
  })
})
