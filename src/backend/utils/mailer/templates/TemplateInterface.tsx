export interface Template {
  fromEmailAddress: string
  title: string
  id: string
  displayMessage: string
  injectedValues: Record<string, any> | undefined
}
