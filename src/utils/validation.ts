import {
  url as vUrl,
  object as vObject,
  string as vString,
  parse as vParse,
  safeParse as vSafeParse,
  minLength as vMinLength,
  maxLength as vMaxLength,
  pipe as vPipe,
  nonEmpty as vNonEmpty,
  startsWith as vStartsWith,
  ObjectSchema,
  ObjectEntries,
  ErrorMessage,
  ObjectIssue,
} from "valibot";

export class Validation {
  static readonly httpsSchema = vObject({
    url: vPipe(vString(), vStartsWith("https://")),
  });
  static validateThrow<
    T extends ObjectEntries,
    V extends ErrorMessage<ObjectIssue>
  >(schema: ObjectSchema<T, V>, object: Record<string, any>) {
    return vParse(schema, object);
  }

  static validateSafe<
    T extends ObjectEntries,
    V extends ErrorMessage<ObjectIssue>
  >(schema: ObjectSchema<T, V>, object: Record<string, any>) {
    return vSafeParse(schema, object);
  }
}
