import { ConfigFile, SubscriptionArtifact, SubscriptionStore } from '../lib';
export declare function subscriptionStore<_Data, _Input>({ config, artifact, }: {
    config: ConfigFile;
    artifact: SubscriptionArtifact;
}): SubscriptionStore<_Data | null, _Input>;
