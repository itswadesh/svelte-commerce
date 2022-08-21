import type { ConfigFile } from './config';
import { MutationArtifact, QueryArtifact, SubscriptionArtifact, SubscriptionSelection } from './types';
export declare function marshalSelection({ config, selection, data, }: {
    config: ConfigFile;
    selection: SubscriptionSelection;
    data: unknown;
}): {} | null | undefined;
export declare function marshalInputs<T>({ artifact, config, input, rootType, }: {
    artifact: QueryArtifact | MutationArtifact | SubscriptionArtifact;
    config: ConfigFile;
    input: unknown;
    rootType?: string;
}): {} | null | undefined;
export declare function unmarshalSelection(config: ConfigFile, selection: SubscriptionSelection, data: unknown): {} | null | undefined;
export declare function isScalar(config: ConfigFile, type: string): boolean;
