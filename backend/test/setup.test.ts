import { cleanAll } from "./utils/clean-all"
import { noEmails } from "./utils/no-emails"

before(noEmails)
before(cleanAll)