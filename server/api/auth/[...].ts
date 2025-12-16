import AuthentikProvider from 'next-auth/providers/authentik'
import { NuxtAuthHandler } from '#auth'

const runtimeConfig = useRuntimeConfig()

export default NuxtAuthHandler({
    // A secret string you define, to ensure correct encryption
    secret: runtimeConfig.authSecret,
    providers: [
        // @ts-expect-error Use .default here for it to work during SSR.
        AuthentikProvider.default({
            clientId: runtimeConfig.authentik.clientId,
            clientSecret: runtimeConfig.authentik.clientSecret,
            issuer: runtimeConfig.authentik.issuer,
        })
    ]
})