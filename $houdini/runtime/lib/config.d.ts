import type { GraphQLSchema } from 'graphql';
import { CachePolicy } from './types';
export declare type ScalarSpec = {
    type: string;
    marshal?: (val: any) => any;
    unmarshal?: (val: any) => any;
};
declare type ScalarMap = {
    [typeName: string]: ScalarSpec;
};
export declare type ConfigFile = {
    /**
     * A glob pointing at all your graphql operations
     * @example glob: `src/** /*.{svelte,gql}`
     */
    sourceGlob: string;
    /**
     * A static representation of your schema
     * @example path: `schema.graphql`
     * @example glob: `src/** /*.graphql`
     *
     * FYI: `schemaPath` or `schema` should be defined
     */
    schemaPath?: string;
    /**
     * Raw graphql schema
     *
     * FYI: `schemaPath` or `schema` should be defined
     */
    schema?: string | GraphQLSchema;
    /**
     * @deprecated use logLevel instead.
     */
    quiet?: boolean;
    /**
     * A url to use to pull the schema. For more information: https://www.houdinigraphql.com/api/cli#generate
     */
    apiUrl?: string;
    /**
     * A boolean that tells the preprocessor to treat every component as a non-route. This is useful for projects built with the static-adapter
     */
    static?: boolean;
    /**
     * An object describing custom scalars for your project. For more information: https://www.houdinigraphql.com/api/config#custom-scalars
     */
    scalars?: ScalarMap;
    /**
     * A path that the generator will use to write schema.graphql and documents.gql files containing all of the internal fragment and directive definitions used in the project.
     */
    definitionsPath?: string;
    /**
     * One of "kit", "sapper", or "svelte". Used to tell the preprocessor what kind of loading paradigm to generate for you. (default: kit)
     */
    framework?: 'kit' | 'sapper' | 'svelte';
    /**
     * One of "esm" or "commonjs". Tells the artifact generator what kind of modules to create. (default: esm)
     */
    module?: 'esm' | 'commonjs';
    /**
     * The number of queries that must occur before a value is removed from the cache. For more information: https://www.houdinigraphql.com/guides/caching-data
     */
    cacheBufferSize?: number;
    /**
     * The default cache policy to use for queries. For more information: https://www.houdinigraphql.com/guides/caching-data
     */
    defaultCachePolicy?: CachePolicy;
    /**
     * Specifies wether or not the cache should always use partial data. For more information: https://www.houdinigraphql.com/guides/caching-data#partial-data
     */
    defaultPartial?: boolean;
    /**
     * A list of fields to use when computing a record’s id. The default value is ['id']. For more information: https://www.houdinigraphql.com/guides/caching-data#custom-ids
     */
    defaultKeys?: string[];
    /**
     * An object that customizes the resolution behavior for a specific type. For more information: https://www.houdinigraphql.com/guides/caching-data#custom-ids
     */
    types?: TypeConfig;
    /**
     * Specifies the style of logging houdini will use when generating your file. One of “quiet”, “full”, “summary”, or “short-summary”.
     */
    logLevel?: string;
    /**
     * A flag to disable fragment masking when generating your document types
     */
    disableMasking?: boolean;
    /**
     * A function to customize the logic houdini uses to identify a route or component when the file
     * is _inside_ of the routesDir. You do not need to define this if you have a custom value in
     * your SvelteKit config file - Houdini will use what's there.
     */
    routes?: (filepath: string) => boolean;
    /**
     * The directory containing your project routes. For default Kit and Sapper projects, this
     * value is ./src/routes
     */
    routesDir?: string;
    /**
     * The path to your framework config file relative to the houdini config file. By
     * default, Houdini will look for your framework config file in process.cwd()
     * however that's not always valid. Use this option to customize where houdini looks.
     */
    frameworkConfigFile?: string;
};
export declare type TypeConfig = {
    [typeName: string]: {
        keys?: string[];
        resolve: {
            queryField: string;
            arguments?: (data: any) => {
                [key: string]: any;
            };
        };
    };
};
export declare function defaultConfigValues(file: ConfigFile): ConfigFile;
export declare function keyFieldsForType(configFile: ConfigFile, type: string): string[];
export declare function computeID(configFile: ConfigFile, type: string, data: any): string;
export {};
