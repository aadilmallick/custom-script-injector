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
} from "valibot";

export const httpsSchema = vPipe(vString(), vUrl(), vStartsWith("https://"));
