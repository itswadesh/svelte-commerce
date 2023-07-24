import { env } from "$env/dynamic/public";

export const SELECTED_ENV: string = env.PUBLIC_SELECTED_SERVICE || 'LITEKART';
export const SERVICE_LIST = {
    LITEKART: 'LITEKART',
    MEDUSAJS: 'MEDUSAJS',
    WOOCOMMERCE: 'WOOCOMMERCE',
    BIGCOMMERCE: 'BIGCOMMERCE',
    SHOPIFY: 'SHOPIFY'
}