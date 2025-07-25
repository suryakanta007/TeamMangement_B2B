export  const ProviderEnum = {
    GOOGLE:"GOOGLE",
    FACEBOOK:"FACEBOOK",
    TWITTER:"TWITTER",
    LINKEDIN:"LINKEDIN",
    GITHUB:"GITHUB"
}

export type ProviderEnumType = keyof typeof ProviderEnum;