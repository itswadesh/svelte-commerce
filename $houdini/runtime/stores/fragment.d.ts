import { ConfigFile, FragmentStore, GraphQLObject, QueryArtifact } from '../lib';
import { PaginatedHandlers } from '../lib/pagination';
export declare function fragmentStore<_Data extends GraphQLObject, _Input = {}>({ artifact, config, paginatedArtifact, paginationMethods, storeName, }: {
    artifact: QueryArtifact;
    config: ConfigFile;
    paginated: QueryArtifact;
    paginatedArtifact?: QueryArtifact;
    paginationMethods: (keyof PaginatedHandlers<_Data, _Input>)[];
    storeName: string;
}): FragmentStore<_Data | null>;
