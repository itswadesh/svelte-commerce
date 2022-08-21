import { ConfigFile, MutationStore } from '../lib';
import type { MutationArtifact } from '../lib';
export declare function mutationStore<_Data, _Input>({ config, artifact, }: {
    config: ConfigFile;
    artifact: MutationArtifact;
}): MutationStore<_Data, _Input>;
