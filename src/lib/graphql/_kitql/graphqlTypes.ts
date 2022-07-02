import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Address = {
  __typename?: 'Address';
  active?: Maybe<Scalars['Boolean']>;
  address?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  district?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  fullName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isResidential?: Maybe<Scalars['Boolean']>;
  lastName?: Maybe<Scalars['String']>;
  lat?: Maybe<Scalars['Float']>;
  lng?: Maybe<Scalars['Float']>;
  locality?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  store?: Maybe<Scalars['ID']>;
  town?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  user?: Maybe<Scalars['ID']>;
  verified?: Maybe<Scalars['Boolean']>;
  zip?: Maybe<Scalars['String']>;
};

export type AddressInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  address?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  district?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  lastName?: InputMaybe<Scalars['String']>;
  lat?: InputMaybe<Scalars['Float']>;
  lng?: InputMaybe<Scalars['Float']>;
  phone?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  town?: InputMaybe<Scalars['String']>;
  zip?: InputMaybe<Scalars['Int']>;
};

export type AdminNotification = {
  __typename?: 'AdminNotification';
  lowStockNotification?: Maybe<Scalars['Boolean']>;
  newOrderPlaced?: Maybe<Scalars['Boolean']>;
};

export type AdminNotificationIp = {
  lowStockNotification?: InputMaybe<Scalars['Boolean']>;
  newOrderPlaced?: InputMaybe<Scalars['Boolean']>;
};

export type Amount = {
  __typename?: 'Amount';
  currency?: Maybe<Scalars['String']>;
  discount?: Maybe<Scalars['Float']>;
  exchangeRate?: Maybe<Scalars['Float']>;
  qty?: Maybe<Scalars['Int']>;
  shipping?: Maybe<Scalars['Float']>;
  subtotal?: Maybe<Scalars['Float']>;
  tax?: Maybe<Scalars['Float']>;
  total?: Maybe<Scalars['Float']>;
  totalDiscount?: Maybe<Scalars['Float']>;
};

export type AppKeyAndToken = {
  __typename?: 'AppKeyAndToken';
  appkey?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
  uid?: Maybe<Scalars['Int']>;
};

export type Appointment = {
  __typename?: 'Appointment';
  createdAt: Scalars['String'];
  date?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  event?: Maybe<Event>;
  from?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  phone?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  to?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  uid?: Maybe<User>;
  updatedAt: Scalars['String'];
  user?: Maybe<User>;
};

export type Attribute = {
  __typename?: 'Attribute';
  active?: Maybe<Scalars['Boolean']>;
  category?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  show?: Maybe<Scalars['Boolean']>;
  store?: Maybe<Scalars['ID']>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type Bs = {
  __typename?: 'BS';
  _id?: Maybe<BsDate>;
  amount?: Maybe<Scalars['Int']>;
  count?: Maybe<Scalars['Int']>;
  items?: Maybe<Array<Maybe<Bs1>>>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type Bs1 = {
  __typename?: 'BS1';
  category?: Maybe<Category>;
  id?: Maybe<Scalars['ID']>;
  img?: Maybe<Scalars['String']>;
  imgCdn?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  pid?: Maybe<Scalars['ID']>;
  price?: Maybe<Scalars['Float']>;
  ratings?: Maybe<Scalars['String']>;
  reviews?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  store?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type BsDate = {
  __typename?: 'BSDate';
  date?: Maybe<Scalars['String']>;
};

export type Badge = {
  __typename?: 'Badge';
  featured?: Maybe<Scalars['Boolean']>;
  hot?: Maybe<Scalars['Boolean']>;
  new?: Maybe<Scalars['Boolean']>;
  recommended?: Maybe<Scalars['Boolean']>;
  sale?: Maybe<Scalars['Boolean']>;
  trending?: Maybe<Scalars['Boolean']>;
};

export type BadgeI = {
  featured?: InputMaybe<Scalars['Boolean']>;
  hot?: InputMaybe<Scalars['Boolean']>;
  new?: InputMaybe<Scalars['Boolean']>;
  recommended?: InputMaybe<Scalars['Boolean']>;
  sale?: InputMaybe<Scalars['Boolean']>;
  trending?: InputMaybe<Scalars['Boolean']>;
};

export type BankTransfer = {
  __typename?: 'BankTransfer';
  amount?: Maybe<Scalars['Float']>;
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  paymentMethodId?: Maybe<Scalars['String']>;
  reference?: Maybe<Scalars['String']>;
  remark?: Maybe<Scalars['String']>;
  store?: Maybe<Store>;
  type?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  user?: Maybe<User>;
  verified?: Maybe<Scalars['Boolean']>;
  verifiedAt?: Maybe<Scalars['String']>;
  verifiedBy?: Maybe<User>;
};

export type Banner = {
  __typename?: 'Banner';
  active?: Maybe<Scalars['Boolean']>;
  createdAt: Scalars['String'];
  groupId?: Maybe<Scalars['String']>;
  groupTitle?: Maybe<Scalars['String']>;
  heading?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  img?: Maybe<Scalars['String']>;
  imgCdn?: Maybe<Scalars['String']>;
  isLinkExternal?: Maybe<Scalars['Boolean']>;
  isMobile?: Maybe<Scalars['Boolean']>;
  link?: Maybe<Scalars['String']>;
  pageId?: Maybe<Scalars['String']>;
  pageType?: Maybe<Scalars['String']>;
  sort?: Maybe<Scalars['Int']>;
  store?: Maybe<Store>;
  type?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
};

export type BestSellers = {
  __typename?: 'BestSellers';
  t?: Maybe<Array<Maybe<Bs>>>;
  t1?: Maybe<Array<Maybe<Bs>>>;
  t2?: Maybe<Array<Maybe<Bs>>>;
  t3?: Maybe<Array<Maybe<Bs>>>;
  t4?: Maybe<Array<Maybe<Bs>>>;
};

export type Blog = {
  __typename?: 'Blog';
  active?: Maybe<Scalars['Boolean']>;
  content?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  excerpt?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  img?: Maybe<Scalars['String']>;
  imgCdn?: Maybe<Scalars['String']>;
  published_at?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  store?: Maybe<Store>;
  tags?: Maybe<Array<Maybe<Scalars['String']>>>;
  title?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  user?: Maybe<User>;
};

export type Brand = {
  __typename?: 'Brand';
  active?: Maybe<Scalars['Boolean']>;
  banner?: Maybe<Scalars['String']>;
  bannerCdn?: Maybe<Scalars['String']>;
  brandId?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  facebookUrl?: Maybe<Scalars['String']>;
  featured?: Maybe<Scalars['Boolean']>;
  googleUrl?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  img?: Maybe<Scalars['String']>;
  imgCdn?: Maybe<Scalars['String']>;
  info?: Maybe<Scalars['String']>;
  instaUrl?: Maybe<Scalars['String']>;
  linkedinUrl?: Maybe<Scalars['String']>;
  meta?: Maybe<Scalars['String']>;
  metaDescription?: Maybe<Scalars['String']>;
  metaKeywords?: Maybe<Scalars['String']>;
  metaTitle?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Brand>;
  pinterestUrl?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Int']>;
  sizechart?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  store?: Maybe<Store>;
  twitterUrl?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  user?: Maybe<User>;
  youtubeUrl?: Maybe<Scalars['String']>;
};

export enum CacheControlScope {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type Cart = {
  __typename?: 'Cart';
  active?: Maybe<Scalars['Boolean']>;
  cart_id?: Maybe<Cart>;
  createdAt: Scalars['String'];
  currencyCode?: Maybe<Scalars['String']>;
  currencyName?: Maybe<Scalars['String']>;
  currencySymbol?: Maybe<Scalars['String']>;
  discount?: Maybe<CartDiscount>;
  formattedAmount?: Maybe<CartAmount>;
  id?: Maybe<Scalars['ID']>;
  items?: Maybe<Array<Maybe<CartItem>>>;
  needAddress?: Maybe<Scalars['Boolean']>;
  offer_total?: Maybe<Scalars['Float']>;
  qty?: Maybe<Scalars['Int']>;
  shipping?: Maybe<Shipping>;
  sid?: Maybe<Scalars['String']>;
  store?: Maybe<Store>;
  storeCurrency?: Maybe<Scalars['ID']>;
  subtotal?: Maybe<Scalars['Float']>;
  tax?: Maybe<Scalars['Float']>;
  total?: Maybe<Scalars['Float']>;
  uid?: Maybe<User>;
  unavailableItems?: Maybe<Array<Maybe<CartItem>>>;
  updatedAt: Scalars['String'];
};

export type CartAmount = {
  __typename?: 'CartAmount';
  offer_total?: Maybe<Scalars['String']>;
  subtotal?: Maybe<Scalars['String']>;
  tax?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['String']>;
};

export type CartDiscount = {
  __typename?: 'CartDiscount';
  amount?: Maybe<Scalars['Float']>;
  code?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['Float']>;
};

export type CartItem = {
  __typename?: 'CartItem';
  barcode?: Maybe<Scalars['String']>;
  brand?: Maybe<Brand>;
  brandName?: Maybe<Scalars['String']>;
  deliveryDetails?: Maybe<Scalars['String']>;
  foodType?: Maybe<Scalars['String']>;
  formattedItemAmount?: Maybe<CartItemAmount>;
  img?: Maybe<Scalars['String']>;
  imgCdn?: Maybe<Scalars['String']>;
  mrp?: Maybe<Scalars['Float']>;
  msg?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  options?: Maybe<Array<Maybe<Option1>>>;
  orderStatus?: Maybe<Array<Maybe<OrderStatusRes>>>;
  pid?: Maybe<Scalars['ID']>;
  price?: Maybe<Scalars['Float']>;
  qty?: Maybe<Scalars['Int']>;
  shippingCharge?: Maybe<Scalars['Float']>;
  slug?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  tax?: Maybe<Scalars['Float']>;
  time?: Maybe<Scalars['String']>;
  tracking?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  usedOptions?: Maybe<Array<Maybe<UsedOption>>>;
  vendor?: Maybe<Scalars['ID']>;
  vendorBusinessName?: Maybe<Scalars['String']>;
  vendorSlug?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['ID']>;
};

export type CartItemAmount = {
  __typename?: 'CartItemAmount';
  mrp?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['String']>;
  shippingCharge?: Maybe<Scalars['String']>;
  tax?: Maybe<Scalars['String']>;
};

export type CartOne = {
  __typename?: 'CartOne';
  active?: Maybe<Scalars['Boolean']>;
  cart_id?: Maybe<Scalars['ID']>;
  createdAt: Scalars['String'];
  currencyCode?: Maybe<Scalars['String']>;
  currencyName?: Maybe<Scalars['String']>;
  currencySymbol?: Maybe<Scalars['String']>;
  discount?: Maybe<CartDiscount>;
  formattedAmount?: Maybe<CartAmount>;
  id?: Maybe<Scalars['ID']>;
  items?: Maybe<Array<Maybe<Scalars['ID']>>>;
  needAddress?: Maybe<Scalars['Boolean']>;
  offer_total?: Maybe<Scalars['Float']>;
  qty?: Maybe<Scalars['Int']>;
  shipping?: Maybe<Shipping>;
  sid?: Maybe<Scalars['String']>;
  store?: Maybe<Scalars['ID']>;
  storeCurrency?: Maybe<Scalars['ID']>;
  subtotal?: Maybe<Scalars['Float']>;
  tax?: Maybe<Scalars['Float']>;
  total?: Maybe<Scalars['Float']>;
  uid?: Maybe<Scalars['ID']>;
  unavailableItems?: Maybe<Array<Maybe<Scalars['ID']>>>;
  updatedAt: Scalars['String'];
};

export type CashfreeRes = {
  __typename?: 'CashfreeRes';
  appId?: Maybe<Scalars['String']>;
  customerEmail?: Maybe<Scalars['String']>;
  customerName?: Maybe<Scalars['String']>;
  customerPhone?: Maybe<Scalars['String']>;
  notifyUrl?: Maybe<Scalars['String']>;
  orderAmount?: Maybe<Scalars['Float']>;
  orderCurrency?: Maybe<Scalars['String']>;
  orderId?: Maybe<Scalars['String']>;
  orderNote?: Maybe<Scalars['String']>;
  returnUrl?: Maybe<Scalars['String']>;
  signature?: Maybe<Scalars['String']>;
  stage?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type Category = {
  __typename?: 'Category';
  _id?: Maybe<Scalars['ID']>;
  active?: Maybe<Scalars['Boolean']>;
  attributes?: Maybe<Array<Maybe<Attribute>>>;
  banner?: Maybe<Scalars['String']>;
  bannerCdn?: Maybe<Scalars['String']>;
  brand?: Maybe<Brand>;
  categoryId?: Maybe<Scalars['String']>;
  children?: Maybe<Array<Maybe<Category>>>;
  count?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  featured?: Maybe<Scalars['Boolean']>;
  featuredSort?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  img?: Maybe<Scalars['String']>;
  imgCdn?: Maybe<Scalars['String']>;
  index?: Maybe<Scalars['Int']>;
  keywords?: Maybe<Scalars['String']>;
  level?: Maybe<Scalars['Int']>;
  link?: Maybe<Scalars['String']>;
  megamenu?: Maybe<Scalars['Boolean']>;
  meta?: Maybe<Scalars['String']>;
  metaDescription?: Maybe<Scalars['String']>;
  metaKeywords?: Maybe<Scalars['String']>;
  metaTitle?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  namePath?: Maybe<Scalars['String']>;
  parent?: Maybe<Category>;
  path?: Maybe<Scalars['String']>;
  pathA?: Maybe<Array<Maybe<Category>>>;
  position?: Maybe<Scalars['Int']>;
  shopbycategory?: Maybe<Scalars['Boolean']>;
  sizechart?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  slugPath?: Maybe<Scalars['String']>;
  store?: Maybe<Store>;
  updatedAt?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type CategorySimple = {
  __typename?: 'CategorySimple';
  _id?: Maybe<Scalars['ID']>;
  active?: Maybe<Scalars['Boolean']>;
  banner?: Maybe<Scalars['String']>;
  bannerCdn?: Maybe<Scalars['String']>;
  brand?: Maybe<Scalars['ID']>;
  categoryId?: Maybe<Scalars['ID']>;
  children?: Maybe<Array<Maybe<CategorySimple>>>;
  count?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  featured?: Maybe<Scalars['Boolean']>;
  featuredSort?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  img?: Maybe<Scalars['String']>;
  imgCdn?: Maybe<Scalars['String']>;
  index?: Maybe<Scalars['Int']>;
  keywords?: Maybe<Scalars['String']>;
  level?: Maybe<Scalars['Int']>;
  link?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
  megamenu?: Maybe<Scalars['Boolean']>;
  meta?: Maybe<Scalars['String']>;
  metaDescription?: Maybe<Scalars['String']>;
  metaKeywords?: Maybe<Scalars['String']>;
  metaTitle?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  namePath?: Maybe<Scalars['String']>;
  parent?: Maybe<Scalars['ID']>;
  path?: Maybe<Scalars['String']>;
  pathA?: Maybe<Array<Maybe<Scalars['ID']>>>;
  position?: Maybe<Scalars['Int']>;
  shopbycategory?: Maybe<Scalars['Boolean']>;
  sizechart?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  slugPath?: Maybe<Scalars['String']>;
  store?: Maybe<Scalars['ID']>;
  updatedAt?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type Channel = {
  __typename?: 'Channel';
  cid?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  ctime?: Maybe<Scalars['String']>;
  hlsPullUrl?: Maybe<Scalars['String']>;
  httpPullUrl?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  img?: Maybe<Scalars['String']>;
  imgCdn?: Maybe<Scalars['String']>;
  isLive?: Maybe<Scalars['Boolean']>;
  msg?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  product?: Maybe<Product>;
  products?: Maybe<Array<Maybe<Product>>>;
  pushUrl?: Maybe<Scalars['String']>;
  requestId?: Maybe<Scalars['String']>;
  rtmpPullUrl?: Maybe<Scalars['String']>;
  scheduleDateTime?: Maybe<Scalars['Float']>;
  title?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
};

export type ChannelList = {
  __typename?: 'ChannelList';
  channel_name?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  user_count?: Maybe<Scalars['Int']>;
};

export type ChannelOne = {
  __typename?: 'ChannelOne';
  cid?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  ctime?: Maybe<Scalars['String']>;
  hlsPullUrl?: Maybe<Scalars['String']>;
  httpPullUrl?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  img?: Maybe<Scalars['String']>;
  imgCdn?: Maybe<Scalars['String']>;
  isLive?: Maybe<Scalars['Boolean']>;
  msg?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  product?: Maybe<Scalars['ID']>;
  products?: Maybe<Array<Maybe<Scalars['ID']>>>;
  pushUrl?: Maybe<Scalars['String']>;
  requestId?: Maybe<Scalars['String']>;
  rtmpPullUrl?: Maybe<Scalars['String']>;
  scheduleDateTime?: Maybe<Scalars['Float']>;
  title?: Maybe<Scalars['String']>;
  user: Scalars['ID'];
  users?: Maybe<Array<Maybe<Scalars['ID']>>>;
};

export type ChannelRes = {
  __typename?: 'ChannelRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Channel>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type Collection = {
  __typename?: 'Collection';
  active?: Maybe<Scalars['Boolean']>;
  createdAt?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  images?: Maybe<Array<Maybe<Scalars['String']>>>;
  img?: Maybe<Scalars['String']>;
  imgCdn?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  products?: Maybe<Array<Maybe<Scalars['ID']>>>;
  q?: Maybe<Scalars['String']>;
  sort?: Maybe<Scalars['String']>;
  store?: Maybe<Store>;
  type?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type CollectionOne = {
  __typename?: 'CollectionOne';
  active?: Maybe<Scalars['Boolean']>;
  createdAt?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  images?: Maybe<Array<Maybe<Scalars['String']>>>;
  img?: Maybe<Scalars['String']>;
  imgCdn?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  products?: Maybe<Array<Maybe<Product>>>;
  q?: Maybe<Scalars['String']>;
  sort?: Maybe<Scalars['String']>;
  store?: Maybe<Store>;
  type?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type Color = {
  __typename?: 'Color';
  active?: Maybe<Scalars['Boolean']>;
  color_code?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  featured?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  info?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  store?: Maybe<Store>;
  updatedAt: Scalars['String'];
  val?: Maybe<Scalars['String']>;
};

export type ColorGroup = {
  __typename?: 'ColorGroup';
  _id?: Maybe<Scalars['ID']>;
  color?: Maybe<Color>;
};

export type CommonShipment = {
  __typename?: 'CommonShipment';
  customerAddress?: Maybe<Address>;
  distance_unit?: Maybe<Scalars['String']>;
  height?: Maybe<Scalars['Float']>;
  items?: Maybe<Array<Maybe<OrderItem>>>;
  length?: Maybe<Scalars['Float']>;
  mass_unit?: Maybe<Scalars['String']>;
  vendorAddress?: Maybe<Address>;
  weight?: Maybe<Scalars['Float']>;
  width?: Maybe<Scalars['Float']>;
};

export type Coords = {
  __typename?: 'Coords';
  lat?: Maybe<Scalars['Float']>;
  lng?: Maybe<Scalars['Float']>;
};

export type Country = {
  __typename?: 'Country';
  active?: Maybe<Scalars['Boolean']>;
  code?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  dialCode?: Maybe<Scalars['String']>;
  flag?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  img?: Maybe<Scalars['String']>;
  imgCdn?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  slug?: Maybe<Scalars['String']>;
  sort?: Maybe<Scalars['Int']>;
  states?: Maybe<Array<Maybe<State>>>;
  updatedAt: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type Coupon = {
  __typename?: 'Coupon';
  active?: Maybe<Scalars['Boolean']>;
  code?: Maybe<Scalars['String']>;
  codes?: Maybe<Array<Maybe<UniqueCode>>>;
  color?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  discount?: Maybe<Discount1>;
  id: Scalars['ID'];
  info?: Maybe<Scalars['String']>;
  isMultiple?: Maybe<Scalars['Boolean']>;
  maxAmount?: Maybe<Scalars['Float']>;
  maxUselimit?: Maybe<Scalars['Int']>;
  msg?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  oneUsePerCustomer?: Maybe<Scalars['Boolean']>;
  oneUsePerUniqueCode?: Maybe<Scalars['Boolean']>;
  store?: Maybe<Store>;
  terms?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  used?: Maybe<Scalars['Int']>;
  validFrom?: Maybe<Scalars['String']>;
  validTo?: Maybe<Scalars['String']>;
};

export type Currency = {
  __typename?: 'Currency';
  active?: Maybe<Scalars['Boolean']>;
  createdAt?: Maybe<Scalars['String']>;
  decimalDigits?: Maybe<Scalars['Int']>;
  decimalMark?: Maybe<Scalars['String']>;
  disambiguateSymbol?: Maybe<Scalars['String']>;
  htmlEntity?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  isoCode?: Maybe<Scalars['String']>;
  isoNumericCode?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  smallestDenomination?: Maybe<Scalars['Float']>;
  sort?: Maybe<Scalars['Int']>;
  subUnit?: Maybe<Scalars['String']>;
  subunitToUnit?: Maybe<Scalars['Float']>;
  symbol?: Maybe<Scalars['String']>;
  symbolFirst?: Maybe<Scalars['Boolean']>;
  thousandsSeparator?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type CustomerMessage = {
  __typename?: 'CustomerMessage';
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  message?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  store?: Maybe<Store>;
};

export type CustomerMessageRes = {
  __typename?: 'CustomerMessageRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<CustomerMessage>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type Deal = {
  __typename?: 'Deal';
  active?: Maybe<Scalars['Boolean']>;
  dealStatus?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
  endTime?: Maybe<Scalars['String']>;
  endTimeISO?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  img?: Maybe<Scalars['String']>;
  imgCdn?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  onGoing?: Maybe<Scalars['Boolean']>;
  products?: Maybe<Array<Maybe<Product>>>;
  startTime?: Maybe<Scalars['String']>;
  startTimeISO?: Maybe<Scalars['String']>;
  store?: Maybe<Store>;
};

export type DealOne = {
  __typename?: 'DealOne';
  active?: Maybe<Scalars['Boolean']>;
  dealStatus?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
  endTime?: Maybe<Scalars['String']>;
  endTimeISO?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  img?: Maybe<Scalars['String']>;
  imgCdn?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  onGoing?: Maybe<Scalars['Boolean']>;
  products?: Maybe<Array<Maybe<Scalars['ID']>>>;
  startTime?: Maybe<Scalars['String']>;
  startTimeISO?: Maybe<Scalars['String']>;
  store?: Maybe<Scalars['ID']>;
};

export type DealRes = {
  __typename?: 'DealRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Deal>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type Delivery = {
  __typename?: 'Delivery';
  finish?: Maybe<Coords>;
  otp?: Maybe<Scalars['String']>;
};

export type DeliveryByVendor = {
  __typename?: 'DeliveryByVendor';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Delv>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type DeliveryGroup = {
  __typename?: 'DeliveryGroup';
  _id?: Maybe<Scalars['String']>;
  count?: Maybe<Scalars['Int']>;
  items?: Maybe<Array<Maybe<Order>>>;
  total?: Maybe<Scalars['Float']>;
};

export type Delv = {
  __typename?: 'Delv';
  _id?: Maybe<Delv2>;
  count?: Maybe<Scalars['Int']>;
  date?: Maybe<Scalars['String']>;
  items?: Maybe<Array<Maybe<CartItem>>>;
  total?: Maybe<Scalars['Float']>;
};

export type Delv2 = {
  __typename?: 'Delv2';
  vendor?: Maybe<Vendor>;
};

export type Discount = {
  __typename?: 'Discount';
  active?: Maybe<Scalars['Boolean']>;
  amount?: Maybe<Scalars['Float']>;
  applyOn?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  img?: Maybe<Scalars['String']>;
  imgCdn?: Maybe<Scalars['String']>;
  maximumUsage?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  numberOfTimeUsed?: Maybe<Scalars['Int']>;
  q?: Maybe<Scalars['String']>;
  ruleType?: Maybe<Scalars['String']>;
  seller?: Maybe<User>;
  slug?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['String']>;
  store?: Maybe<Store>;
  type?: Maybe<Scalars['String']>;
};

export type Discount1 = {
  __typename?: 'Discount1';
  category?: Maybe<Scalars['ID']>;
  currency?: Maybe<Scalars['ID']>;
  excludeCategories?: Maybe<Array<Maybe<Scalars['ID']>>>;
  isPercent?: Maybe<Scalars['Boolean']>;
  maxProductQty?: Maybe<Scalars['Int']>;
  minOrderTotal?: Maybe<Scalars['Float']>;
  minProductPrice?: Maybe<Scalars['Float']>;
  minProductQty?: Maybe<Scalars['Int']>;
  product?: Maybe<Scalars['ID']>;
  shippingMethod?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['Float']>;
};

export type DiscountIp = {
  category?: InputMaybe<Scalars['ID']>;
  currency?: InputMaybe<Scalars['ID']>;
  excludeCategories?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  isPercent?: InputMaybe<Scalars['Boolean']>;
  maxProductQty?: InputMaybe<Scalars['Int']>;
  minOrderTotal?: InputMaybe<Scalars['Float']>;
  minProductPrice?: InputMaybe<Scalars['Float']>;
  minProductQty?: InputMaybe<Scalars['Int']>;
  product?: InputMaybe<Scalars['ID']>;
  shippingMethod?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['Float']>;
};

export type DiscountOne = {
  __typename?: 'DiscountOne';
  active?: Maybe<Scalars['Boolean']>;
  amount?: Maybe<Scalars['Float']>;
  applyOn?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  img?: Maybe<Scalars['String']>;
  imgCdn?: Maybe<Scalars['String']>;
  maximumUsage?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  numberOfTimeUsed?: Maybe<Scalars['Int']>;
  q?: Maybe<Scalars['String']>;
  ruleType?: Maybe<Scalars['String']>;
  seller?: Maybe<Scalars['ID']>;
  slug?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['String']>;
  store?: Maybe<Scalars['ID']>;
  type?: Maybe<Scalars['String']>;
};

export type Email = {
  __typename?: 'Email';
  bcc?: Maybe<Array<Maybe<Scalars['String']>>>;
  cc?: Maybe<Array<Maybe<Scalars['String']>>>;
  enabled?: Maybe<Scalars['Boolean']>;
  from?: Maybe<Scalars['String']>;
  printers?: Maybe<Array<Maybe<Scalars['String']>>>;
  to?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type EmailIp = {
  bcc?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  cc?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  from?: InputMaybe<Scalars['String']>;
  printers?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  to?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Event = {
  __typename?: 'Event';
  active?: Maybe<Scalars['Boolean']>;
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  rules?: Maybe<Array<Maybe<Rule>>>;
  updatedAt: Scalars['String'];
  user?: Maybe<User>;
};

export type FbProduct = {
  __typename?: 'FBProduct';
  age_group?: Maybe<Scalars['String']>;
  availability?: Maybe<Scalars['String']>;
  brand?: Maybe<Scalars['String']>;
  category?: Maybe<Scalars['String']>;
  condition?: Maybe<Scalars['String']>;
  currency?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  gender?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  image_url?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['String']>;
  retailer_id?: Maybe<Scalars['String']>;
  retailer_product_group_id?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type Faq = {
  __typename?: 'Faq';
  active?: Maybe<Scalars['Boolean']>;
  answer?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  opened?: Maybe<Scalars['Boolean']>;
  question?: Maybe<Scalars['String']>;
  store?: Maybe<Store>;
  topic?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
};

export type FaqTopic = {
  __typename?: 'FaqTopic';
  active?: Maybe<Scalars['Boolean']>;
  createdAt: Scalars['String'];
  for?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  q?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  uid?: Maybe<Scalars['ID']>;
  updatedAt: Scalars['String'];
};

export type FcmToken = {
  __typename?: 'FcmToken';
  active?: Maybe<Scalars['Boolean']>;
  createdAt: Scalars['String'];
  device_id?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  platform?: Maybe<Scalars['String']>;
  sId?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  user?: Maybe<User>;
  user_type?: Maybe<Scalars['String']>;
};

export type Feature = {
  __typename?: 'Feature';
  active?: Maybe<Scalars['Boolean']>;
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  product?: Maybe<Scalars['ID']>;
  slug?: Maybe<Scalars['String']>;
  store?: Maybe<Store>;
  type?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type File = {
  __typename?: 'File';
  encoding?: Maybe<Scalars['String']>;
  filename?: Maybe<Scalars['String']>;
  mimetype?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type GdprDataDeleteRequest = {
  __typename?: 'GdprDataDeleteRequest';
  comment?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  reason?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  user?: Maybe<User>;
};

export type GdprDataDeleteRequestOne = {
  __typename?: 'GdprDataDeleteRequestOne';
  comment?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  reason?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  user?: Maybe<Scalars['ID']>;
};

export type GlobalOption = {
  __typename?: 'GlobalOption';
  active?: Maybe<Scalars['Boolean']>;
  categories?: Maybe<Array<Maybe<Scalars['String']>>>;
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  info?: Maybe<Scalars['String']>;
  isFilter?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Int']>;
  preselect?: Maybe<Scalars['Boolean']>;
  required?: Maybe<Scalars['Boolean']>;
  slug?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  val?: Maybe<Scalars['String']>;
  values?: Maybe<Array<Maybe<GlobalOptionValue>>>;
};

export type GlobalOptionValue = {
  __typename?: 'GlobalOptionValue';
  active?: Maybe<Scalars['Boolean']>;
  createdAt: Scalars['String'];
  default?: Maybe<Scalars['Boolean']>;
  global_option_id: Scalars['ID'];
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Int']>;
  slug?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
};

export type GroupRes = {
  __typename?: 'GroupRes';
  colorGroup?: Maybe<Array<Maybe<Product>>>;
  sizeGroup?: Maybe<Array<Maybe<Product>>>;
};

export type ImportDetail = {
  __typename?: 'ImportDetail';
  fileName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  importNo?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  rawNo?: Maybe<Scalars['Int']>;
  success?: Maybe<Scalars['Boolean']>;
  totalItems?: Maybe<Scalars['Int']>;
  type?: Maybe<Scalars['String']>;
  user?: Maybe<Scalars['ID']>;
};

export type Influencer = {
  __typename?: 'Influencer';
  id: Scalars['ID'];
  product?: Maybe<Product>;
  user?: Maybe<User>;
  videos?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type InfluencerOne = {
  __typename?: 'InfluencerOne';
  id: Scalars['ID'];
  product?: Maybe<Scalars['ID']>;
  user?: Maybe<Scalars['ID']>;
  videos?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type InfluencerRes = {
  __typename?: 'InfluencerRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Influencer>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type Info = {
  __typename?: 'Info';
  public?: Maybe<Scalars['Boolean']>;
  store?: Maybe<Scalars['String']>;
  storePhotos?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type InputInfo = {
  public?: InputMaybe<Scalars['Boolean']>;
  store?: InputMaybe<Scalars['String']>;
  storePhotos?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type InstantMessage = {
  __typename?: 'InstantMessage';
  channel?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  uid?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type InstantMessageRes = {
  __typename?: 'InstantMessageRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<InstantMessage>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type Interval = {
  __typename?: 'Interval';
  from?: Maybe<Scalars['String']>;
  isBooked?: Maybe<Scalars['Boolean']>;
  to?: Maybe<Scalars['String']>;
};

export type Inventory = {
  __typename?: 'Inventory';
  action?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  left?: Maybe<Scalars['Int']>;
  notes?: Maybe<Scalars['String']>;
  product?: Maybe<Product>;
  quantity?: Maybe<Scalars['Int']>;
  reason?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  user?: Maybe<User>;
  vendor?: Maybe<Vendor>;
};

export type ItemIp = {
  id?: InputMaybe<Scalars['String']>;
  qty?: InputMaybe<Scalars['Int']>;
};

export type Language = {
  __typename?: 'Language';
  active?: Maybe<Scalars['Boolean']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  nativeName?: Maybe<Scalars['String']>;
  phpLocaleCode?: Maybe<Scalars['String']>;
  rtl?: Maybe<Scalars['Boolean']>;
  sort?: Maybe<Scalars['Int']>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type Location = {
  __typename?: 'Location';
  active: Scalars['Boolean'];
  country?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  lat?: Maybe<Scalars['Float']>;
  lng?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
  updatedAt: Scalars['String'];
  user?: Maybe<User>;
  zip?: Maybe<Scalars['String']>;
  zips?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type LocationOne = {
  __typename?: 'LocationOne';
  active: Scalars['Boolean'];
  country?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  lat?: Maybe<Scalars['Float']>;
  lng?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
  updatedAt: Scalars['String'];
  user?: Maybe<Scalars['ID']>;
  zip?: Maybe<Scalars['String']>;
  zips?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type LoginSetting = {
  __typename?: 'LoginSetting';
  FACEBOOK_ID?: Maybe<Scalars['String']>;
  FACEBOOK_SECRET?: Maybe<Scalars['String']>;
  GITHUB_ID?: Maybe<Scalars['String']>;
  GITHUB_SECRET?: Maybe<Scalars['String']>;
  GOOGLE_ID?: Maybe<Scalars['String']>;
  GOOGLE_SECRET?: Maybe<Scalars['String']>;
  TWITTER_ID?: Maybe<Scalars['String']>;
  TWITTER_SECRET?: Maybe<Scalars['String']>;
};

export type LoginSettingIp = {
  FACEBOOK_ID?: InputMaybe<Scalars['String']>;
  FACEBOOK_SECRET?: InputMaybe<Scalars['String']>;
  GITHUB_ID?: InputMaybe<Scalars['String']>;
  GITHUB_SECRET?: InputMaybe<Scalars['String']>;
  GOOGLE_ID?: InputMaybe<Scalars['String']>;
  GOOGLE_SECRET?: InputMaybe<Scalars['String']>;
  TWITTER_ID?: InputMaybe<Scalars['String']>;
  TWITTER_SECRET?: InputMaybe<Scalars['String']>;
};

export type Media = {
  __typename?: 'Media';
  active?: Maybe<Scalars['Boolean']>;
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  originalFilename?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['String']>;
  src?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  uid?: Maybe<User>;
  updatedAt: Scalars['String'];
  use?: Maybe<Scalars['String']>;
};

export type MethodsSummary = {
  __typename?: 'MethodsSummary';
  _id?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['Float']>;
  count?: Maybe<Scalars['Int']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  OrderRefund?: Maybe<OrderItem>;
  SyncProductsToFacebook?: Maybe<Scalars['Int']>;
  SyncProductsToGoogle?: Maybe<Scalars['Int']>;
  _?: Maybe<Scalars['String']>;
  addAddress?: Maybe<Address>;
  addMoney?: Maybe<OneWallet>;
  addToCart?: Maybe<Cart>;
  applyCoupon?: Maybe<Cart>;
  approveOrCancelReplacement?: Maybe<OrderItem>;
  assignRole?: Maybe<User>;
  attachUserToStore?: Maybe<User>;
  bookAppointment?: Maybe<OneAppointment>;
  braintreeMakePayment?: Maybe<Order>;
  braintreeToken?: Maybe<OnePayment>;
  buyFreeSubscription?: Maybe<Subscribe>;
  buyShippingLabel?: Maybe<ShippoLabel>;
  capturePay?: Maybe<Order>;
  cashfreePayNow?: Maybe<CashfreeRes>;
  cashfreePayNowNew?: Maybe<Payment>;
  cashfreeSubscription?: Maybe<Subscribe>;
  changeCartCurrency?: Maybe<Scalars['Boolean']>;
  changeParentOfCategory?: Maybe<Scalars['Boolean']>;
  changePassword?: Maybe<Scalars['Boolean']>;
  checkout?: Maybe<Order>;
  clearCache?: Maybe<Scalars['Boolean']>;
  clearCart?: Maybe<Scalars['Boolean']>;
  collectPayment?: Maybe<Scalars['Boolean']>;
  commonShipments?: Maybe<Array<Maybe<CommonShipment>>>;
  confirmStripeSubscription?: Maybe<Subscribe>;
  create?: Maybe<Order>;
  createBankTransfer?: Maybe<OneBankTransfer>;
  createBlobContainer?: Maybe<UploadedFileResponse>;
  createDeal?: Maybe<DealOne>;
  createMedia?: Maybe<Media>;
  createMigrationInStore?: Maybe<Scalars['Boolean']>;
  createOrder?: Maybe<Order>;
  createProduct?: Maybe<Product>;
  createSubsciption?: Maybe<Subscribe>;
  deleteAddress?: Maybe<Scalars['Boolean']>;
  deleteAllCategories?: Maybe<Scalars['Int']>;
  deleteAllCustomerMessage?: Maybe<Scalars['Boolean']>;
  deleteAllPopularSearch?: Maybe<Scalars['Int']>;
  deleteAllProducts?: Maybe<Scalars['Int']>;
  deleteAppointment?: Maybe<Scalars['Boolean']>;
  deleteBankTransfer?: Maybe<OneBankTransfer>;
  deleteBanner?: Maybe<Scalars['Boolean']>;
  deleteBlog?: Maybe<Scalars['Boolean']>;
  deleteBrand?: Maybe<Scalars['Boolean']>;
  deleteCart?: Maybe<Scalars['Boolean']>;
  deleteCategory?: Maybe<Scalars['Boolean']>;
  deleteChannel?: Maybe<Scalars['Boolean']>;
  deleteCollection?: Maybe<Scalars['Boolean']>;
  deleteCountry?: Maybe<Scalars['Boolean']>;
  deleteCoupon?: Maybe<OneCoupon>;
  deleteCustomerMessage?: Maybe<Scalars['Boolean']>;
  deleteDiscount?: Maybe<Scalars['Boolean']>;
  deleteEvent?: Maybe<Scalars['Boolean']>;
  deleteFaq?: Maybe<Scalars['Boolean']>;
  deleteFaqTopic?: Maybe<Scalars['Boolean']>;
  deleteFcmToken?: Maybe<Scalars['Boolean']>;
  deleteFile?: Maybe<File>;
  deleteImportDetails?: Maybe<Scalars['Int']>;
  deleteInfluencer?: Maybe<Scalars['Boolean']>;
  deletePaymentMethod?: Maybe<Scalars['Boolean']>;
  deletePopularSearch?: Maybe<Scalars['Boolean']>;
  deleteProduct?: Maybe<Scalars['Boolean']>;
  deleteProductViaBarcode?: Maybe<Scalars['Int']>;
  deletePromotion?: Maybe<Scalars['Boolean']>;
  deleteReferral?: Maybe<OneReferral>;
  deleteRole?: Maybe<Scalars['Boolean']>;
  deleteScheduleDemo?: Maybe<Scalars['Boolean']>;
  deleteState?: Maybe<Scalars['Boolean']>;
  deleteStore?: Maybe<Scalars['Boolean']>;
  deleteSubscription?: Maybe<Scalars['Boolean']>;
  deleteTag?: Maybe<OneTag>;
  deleteTemplate?: Maybe<Scalars['Boolean']>;
  deleteVideo?: Maybe<Scalars['Boolean']>;
  deleteVideos?: Maybe<Scalars['Int']>;
  downloadInvoice?: Maybe<Order>;
  emailPassword?: Maybe<Scalars['String']>;
  facebookMobileLogin?: Maybe<User>;
  fbDeleteProduct?: Maybe<Scalars['Boolean']>;
  fbInsertProduct?: Maybe<Scalars['Boolean']>;
  fileUpload?: Maybe<Array<Maybe<UploadedFileResponse>>>;
  gDeleteProduct?: Maybe<Scalars['Boolean']>;
  gInsertProduct?: Maybe<Scalars['Boolean']>;
  gdprDataDeleteProcess?: Maybe<GdprDataDeleteRequestOne>;
  gdprDataDeleteRequest?: Maybe<GdprDataDeleteRequestOne>;
  getOtp?: Maybe<Otp>;
  getShippingRates?: Maybe<SippoShipment>;
  googleOneTap?: Maybe<User>;
  importAttribute?: Maybe<Scalars['Boolean']>;
  importBanner?: Maybe<Scalars['String']>;
  importBlog?: Maybe<Scalars['String']>;
  importBrand?: Maybe<Scalars['String']>;
  importCategory?: Maybe<Scalars['String']>;
  importColor?: Maybe<Scalars['String']>;
  importFaq?: Maybe<Scalars['String']>;
  importPage?: Maybe<Scalars['String']>;
  importProduct?: Maybe<Scalars['String']>;
  importSize?: Maybe<Scalars['String']>;
  importStore?: Maybe<Scalars['String']>;
  importUser?: Maybe<Scalars['String']>;
  login?: Maybe<User>;
  moveUnavailableProductsIntoWishlist?: Maybe<Scalars['Boolean']>;
  notifyFirebase?: Maybe<FcmToken>;
  paySuccessPageHit?: Maybe<Order>;
  paymentConfirmation?: Maybe<OnePayment>;
  paypalCancel?: Maybe<Order>;
  paypalConfirmation?: Maybe<Order>;
  paypalExecute?: Maybe<Order>;
  paypalPayNow?: Maybe<PayPalRes>;
  paytmCapturePay?: Maybe<Order>;
  paytmPayNow?: Maybe<OnePayment>;
  populateDemoDataInStore?: Maybe<Scalars['Boolean']>;
  pushToNeteaseCDN?: Maybe<Scalars['Boolean']>;
  razorpay?: Maybe<OnePayment>;
  refreshCategorySlug?: Maybe<Scalars['Boolean']>;
  register?: Maybe<User>;
  removeAttribute?: Maybe<Scalars['Boolean']>;
  removeColor?: Maybe<Scalars['Boolean']>;
  removeCoupon?: Maybe<Cart>;
  removeCurrency?: Maybe<Scalars['Boolean']>;
  removeDeal?: Maybe<Scalars['Boolean']>;
  removeDemoDataInStore?: Maybe<Scalars['Boolean']>;
  removeFeature?: Maybe<Scalars['Boolean']>;
  removeGlobalOption?: Maybe<Scalars['Boolean']>;
  removeGlobalOptionValue?: Maybe<Scalars['Boolean']>;
  removeLanguage?: Maybe<Scalars['Boolean']>;
  removeLocation?: Maybe<Scalars['Boolean']>;
  removeOption?: Maybe<Scalars['Boolean']>;
  removeOptionValue?: Maybe<Scalars['Boolean']>;
  removeOrderStatus?: Maybe<Scalars['Boolean']>;
  removePage?: Maybe<Scalars['Boolean']>;
  removeReview?: Maybe<Scalars['Boolean']>;
  removeShippingMethod?: Maybe<Scalars['Boolean']>;
  removeSize?: Maybe<Scalars['Boolean']>;
  removeSlot?: Maybe<Scalars['Boolean']>;
  removeStoreCountry?: Maybe<Scalars['Boolean']>;
  removeStoreCurrency?: Maybe<Scalars['Boolean']>;
  removeStoreLanguage?: Maybe<Scalars['Boolean']>;
  removeUnit?: Maybe<Scalars['Boolean']>;
  removeUser?: Maybe<Scalars['Boolean']>;
  removeUserFromStore?: Maybe<User>;
  removeVariant?: Maybe<Scalars['Boolean']>;
  removeVendor?: Maybe<Scalars['Boolean']>;
  requestAppointment?: Maybe<OneAppointment>;
  resendEmail?: Maybe<Scalars['String']>;
  resetPassword?: Maybe<Scalars['Boolean']>;
  returnOrReplace?: Maybe<OrderItem>;
  rtcToken?: Maybe<TokenRes>;
  saveAddress?: Maybe<Address>;
  saveAttribute?: Maybe<Attribute>;
  saveBankTransfer?: Maybe<OneBankTransfer>;
  saveBanner?: Maybe<OneBanner>;
  saveBlog?: Maybe<OneBlog>;
  saveBrand?: Maybe<OneBrand>;
  saveCategory?: Maybe<CategorySimple>;
  saveChannel?: Maybe<Channel>;
  saveCollection?: Maybe<Collection>;
  saveColor?: Maybe<OneColor>;
  saveCountry?: Maybe<Country>;
  saveCoupon?: Maybe<OneCoupon>;
  saveCurrency?: Maybe<Currency>;
  saveCustomerMessage?: Maybe<OneCustomerMessage>;
  saveDeal?: Maybe<DealOne>;
  saveDiscount?: Maybe<Discount>;
  saveEvent?: Maybe<EventOne>;
  saveFaq?: Maybe<FaqOne>;
  saveFaqTopic?: Maybe<FaqTopic>;
  saveFcmToken?: Maybe<FcmToken>;
  saveFeature?: Maybe<OneFeature>;
  saveGlobalOption?: Maybe<GlobalOption>;
  saveGlobalOptionValue?: Maybe<GlobalOptionValue>;
  saveInfluencer?: Maybe<Influencer>;
  saveInventory?: Maybe<OneInventory>;
  saveLanguage?: Maybe<OneLanguage>;
  saveLocation?: Maybe<Location>;
  saveMyVendor?: Maybe<Vendor>;
  saveOption?: Maybe<OneOption>;
  saveOptionValue?: Maybe<OptionValue>;
  saveOrderStatus?: Maybe<OrderStatusRes>;
  savePage?: Maybe<OnePage>;
  savePaymentMethod?: Maybe<PaymentMethod>;
  savePopularSearch?: Maybe<OnePopularSearch>;
  saveProduct?: Maybe<OneProduct>;
  savePromotion?: Maybe<OnePromotion>;
  saveReferral?: Maybe<OneReferral>;
  saveReview?: Maybe<OneReview>;
  saveRole?: Maybe<Role>;
  saveScheduleDemo?: Maybe<ScheduleDemo>;
  saveSettings?: Maybe<Setting>;
  saveShippingMethod?: Maybe<ShippingMethod>;
  saveSize?: Maybe<OneSize>;
  saveSlot?: Maybe<OneSlot>;
  saveState?: Maybe<OneState>;
  saveStore?: Maybe<OneStore>;
  saveStoreCountry?: Maybe<OneStoreCountry>;
  saveStoreCurrency?: Maybe<OneStoreCurrency>;
  saveStoreLanguage?: Maybe<OneStoreLanguage>;
  saveSubscription?: Maybe<OneSubscription>;
  saveTag?: Maybe<OneTag>;
  saveTemplate?: Maybe<OneTemplate>;
  saveUnit?: Maybe<OneUnit>;
  saveUser?: Maybe<User>;
  saveVariant?: Maybe<Variant>;
  saveVendor?: Maybe<OneVendor>;
  saveVideo?: Maybe<Video>;
  sendInstantMessage?: Maybe<InstantMessage>;
  sendInvitation?: Maybe<Scalars['Boolean']>;
  signInWithApple?: Maybe<User>;
  signOut?: Maybe<Scalars['Boolean']>;
  singleUpload?: Maybe<UploadedFileResponse>;
  stripe?: Maybe<OnePayment>;
  stripeCancel?: Maybe<Order>;
  stripeCapture?: Maybe<Order>;
  stripeMobile?: Maybe<OnePayment>;
  stripeSubscription?: Maybe<Subscribe>;
  syncAutoComplete?: Maybe<Scalars['Int']>;
  syncBrands?: Maybe<Scalars['Int']>;
  syncOrderItemWithShipping?: Maybe<Scalars['Boolean']>;
  syncProductImages?: Maybe<Scalars['Int']>;
  test?: Maybe<Scalars['Boolean']>;
  testAutoRenewSubscribe?: Maybe<Scalars['Boolean']>;
  toggleWishlist?: Maybe<Scalars['Boolean']>;
  updateALLStoreData?: Maybe<Scalars['Boolean']>;
  updateAddress?: Maybe<Address>;
  updateAllBanner?: Maybe<Scalars['Int']>;
  updateAllBrand?: Maybe<Scalars['Int']>;
  updateAllCategory?: Maybe<Scalars['Int']>;
  updateAllProduct?: Maybe<Scalars['Int']>;
  updateAllVendor?: Maybe<Scalars['Int']>;
  updateAppointment?: Maybe<OneAppointment>;
  updateCurrencies?: Maybe<Scalars['Boolean']>;
  updateDeal?: Maybe<DealOne>;
  updateOrder?: Maybe<Order>;
  updateOrderItem?: Maybe<OrderItem>;
  updateProfile?: Maybe<UserOne>;
  updateShippoData?: Maybe<OrderItem>;
  updateStoreTiming?: Maybe<Store>;
  updateVisitorCount?: Maybe<Scalars['Int']>;
  updateWithdrawal?: Maybe<OneWithdrawal>;
  uploadVideo?: Maybe<Array<Maybe<Video>>>;
  vendorVerification?: Maybe<Vendor>;
  verifyEmail?: Maybe<Scalars['Boolean']>;
  verifyOtp?: Maybe<User>;
  withdrawalAmount?: Maybe<OneWithdrawal>;
};


export type MutationOrderRefundArgs = {
  amount: Scalars['Float'];
  email: Scalars['String'];
  note: Scalars['String'];
  orderItemId: Scalars['ID'];
  password: Scalars['String'];
  qty: Scalars['Int'];
};


export type MutationSyncProductsToGoogleArgs = {
  authCode: Scalars['String'];
  batchId: Scalars['String'];
  category?: InputMaybe<Scalars['String']>;
  contentLanguage?: InputMaybe<Scalars['String']>;
  targetCountry?: InputMaybe<Scalars['String']>;
};


export type MutationAddAddressArgs = {
  address?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  company?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  district?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  isResidential?: InputMaybe<Scalars['Boolean']>;
  lastName?: InputMaybe<Scalars['String']>;
  lat?: InputMaybe<Scalars['Float']>;
  lng?: InputMaybe<Scalars['Float']>;
  locality?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
  town?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  zip?: InputMaybe<Scalars['String']>;
};


export type MutationAddMoneyArgs = {
  amount: Scalars['Float'];
};


export type MutationAddToCartArgs = {
  options?: InputMaybe<Array<InputMaybe<OptionIp1>>>;
  pid: Scalars['ID'];
  qty: Scalars['Int'];
  replace?: InputMaybe<Scalars['Boolean']>;
  vendor?: InputMaybe<Scalars['ID']>;
  vid?: InputMaybe<Scalars['ID']>;
};


export type MutationApplyCouponArgs = {
  code: Scalars['String'];
};


export type MutationApproveOrCancelReplacementArgs = {
  action: Scalars['String'];
  id: Scalars['ID'];
};


export type MutationAssignRoleArgs = {
  roleIds: Array<Scalars['ID']>;
  userId: Scalars['ID'];
};


export type MutationAttachUserToStoreArgs = {
  storeId: Scalars['ID'];
  userId: Scalars['ID'];
};


export type MutationBookAppointmentArgs = {
  date?: InputMaybe<Scalars['String']>;
  event: Scalars['ID'];
  from?: InputMaybe<Scalars['String']>;
  to?: InputMaybe<Scalars['String']>;
};


export type MutationBraintreeMakePaymentArgs = {
  nonce: Scalars['String'];
  token: Scalars['String'];
};


export type MutationBraintreeTokenArgs = {
  address?: InputMaybe<Scalars['ID']>;
  slot?: InputMaybe<Scalars['ID']>;
};


export type MutationBuyShippingLabelArgs = {
  shippoRateId: Scalars['String'];
};


export type MutationCapturePayArgs = {
  oid: Scalars['String'];
  paymentId: Scalars['String'];
};


export type MutationCashfreePayNowArgs = {
  address?: InputMaybe<Scalars['ID']>;
  slot?: InputMaybe<Scalars['ID']>;
};


export type MutationCashfreePayNowNewArgs = {
  address?: InputMaybe<Scalars['ID']>;
  slot?: InputMaybe<Scalars['ID']>;
};


export type MutationCashfreeSubscriptionArgs = {
  intervalType?: InputMaybe<Scalars['String']>;
  subscription: Scalars['ID'];
};


export type MutationChangeCartCurrencyArgs = {
  store: Scalars['ID'];
  storeCurrency: Scalars['ID'];
};


export type MutationChangeParentOfCategoryArgs = {
  catId: Scalars['ID'];
  parentCatId: Scalars['ID'];
};


export type MutationChangePasswordArgs = {
  oldPassword: Scalars['String'];
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
};


export type MutationCheckoutArgs = {
  address?: InputMaybe<Scalars['ID']>;
  slot?: InputMaybe<Scalars['ID']>;
};


export type MutationClearCacheArgs = {
  name: Scalars['String'];
};


export type MutationCollectPaymentArgs = {
  codPaid?: InputMaybe<Scalars['Float']>;
  id: Scalars['ID'];
};


export type MutationCommonShipmentsArgs = {
  orderItems: Array<Scalars['ID']>;
};


export type MutationConfirmStripeSubscriptionArgs = {
  paymentReferenceId?: InputMaybe<Scalars['String']>;
  subscribeId?: InputMaybe<Scalars['ID']>;
};


export type MutationCreateArgs = {
  body: Scalars['String'];
  id: Scalars['ID'];
};


export type MutationCreateBankTransferArgs = {
  amount?: InputMaybe<Scalars['Float']>;
  paymentMethodId?: InputMaybe<Scalars['String']>;
  reference?: InputMaybe<Scalars['String']>;
  remark?: InputMaybe<Scalars['String']>;
  store: Scalars['ID'];
  type: Scalars['String'];
};


export type MutationCreateBlobContainerArgs = {
  folder: Scalars['String'];
};


export type MutationCreateDealArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  dealStatus?: InputMaybe<Scalars['Boolean']>;
  description?: InputMaybe<Scalars['String']>;
  endTime?: InputMaybe<Scalars['String']>;
  endTimeISO?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  onGoing?: InputMaybe<Scalars['Boolean']>;
  products?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  startTime?: InputMaybe<Scalars['String']>;
  startTimeISO?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type MutationCreateMediaArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  originalFilename?: InputMaybe<Scalars['String']>;
  path?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['String']>;
  src?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  use?: InputMaybe<Scalars['String']>;
};


export type MutationCreateMigrationInStoreArgs = {
  storeId?: InputMaybe<Scalars['ID']>;
};


export type MutationCreateOrderArgs = {
  address?: InputMaybe<Scalars['ID']>;
  items?: InputMaybe<Array<ItemIp>>;
  user: Scalars['ID'];
};


export type MutationCreateProductArgs = {
  categories?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  category?: InputMaybe<Scalars['ID']>;
  description?: InputMaybe<Scalars['String']>;
  img?: InputMaybe<Scalars['String']>;
  location?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<Scalars['Float']>;
  stock?: InputMaybe<Scalars['Int']>;
  time?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};


export type MutationCreateSubsciptionArgs = {
  intervalType: Scalars['String'];
  subscription: Scalars['ID'];
  user: Scalars['ID'];
};


export type MutationDeleteAddressArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteAllCategoriesArgs = {
  password: Scalars['String'];
};


export type MutationDeleteAllProductsArgs = {
  force?: InputMaybe<Scalars['Boolean']>;
  password: Scalars['String'];
};


export type MutationDeleteAppointmentArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteBankTransferArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteBannerArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteBlogArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteBrandArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteCartArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteChannelArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteCollectionArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteCountryArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteCouponArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteCustomerMessageArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteDiscountArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteEventArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteFaqArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteFaqTopicArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteFcmTokenArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteFileArgs = {
  url?: InputMaybe<Scalars['String']>;
};


export type MutationDeleteImportDetailsArgs = {
  type: Scalars['String'];
};


export type MutationDeleteInfluencerArgs = {
  id: Scalars['ID'];
};


export type MutationDeletePaymentMethodArgs = {
  id: Scalars['ID'];
};


export type MutationDeletePopularSearchArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteProductArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type MutationDeleteProductViaBarcodeArgs = {
  barcodes: Array<Scalars['String']>;
  force?: InputMaybe<Scalars['Boolean']>;
};


export type MutationDeletePromotionArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteReferralArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteRoleArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteScheduleDemoArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteStateArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteStoreArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteSubscriptionArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteTagArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteTemplateArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteVideoArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteVideosArgs = {
  ids?: InputMaybe<Array<Scalars['ID']>>;
};


export type MutationDownloadInvoiceArgs = {
  orderItemId: Scalars['ID'];
};


export type MutationEmailPasswordArgs = {
  email: Scalars['String'];
  referrer: Scalars['String'];
};


export type MutationFacebookMobileLoginArgs = {
  accessToken: Scalars['String'];
};


export type MutationFbDeleteProductArgs = {
  productId: Scalars['String'];
};


export type MutationFbInsertProductArgs = {
  productId: Scalars['ID'];
};


export type MutationFileUploadArgs = {
  files?: InputMaybe<Array<Scalars['Upload']>>;
  folder?: InputMaybe<Scalars['String']>;
  productId?: InputMaybe<Scalars['ID']>;
};


export type MutationGDeleteProductArgs = {
  authCode: Scalars['String'];
  productId: Scalars['ID'];
};


export type MutationGInsertProductArgs = {
  authCode: Scalars['String'];
  productId: Scalars['ID'];
};


export type MutationGdprDataDeleteProcessArgs = {
  comment?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  status: Scalars['String'];
};


export type MutationGdprDataDeleteRequestArgs = {
  description?: InputMaybe<Scalars['String']>;
  reason?: InputMaybe<Scalars['String']>;
};


export type MutationGetOtpArgs = {
  phone: Scalars['String'];
  role?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type MutationGetShippingRatesArgs = {
  distance_unit: Scalars['String'];
  fromAddress: Scalars['ID'];
  height: Scalars['Float'];
  length: Scalars['Float'];
  mass_unit: Scalars['String'];
  toAddress: Scalars['ID'];
  weight: Scalars['Float'];
  width: Scalars['Float'];
};


export type MutationGoogleOneTapArgs = {
  credential: Scalars['String'];
  role?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type MutationImportAttributeArgs = {
  file: Scalars['Upload'];
};


export type MutationImportBannerArgs = {
  file: Scalars['Upload'];
};


export type MutationImportBlogArgs = {
  file: Scalars['Upload'];
};


export type MutationImportBrandArgs = {
  file: Scalars['Upload'];
};


export type MutationImportCategoryArgs = {
  file: Scalars['Upload'];
};


export type MutationImportColorArgs = {
  file: Scalars['Upload'];
};


export type MutationImportFaqArgs = {
  file: Scalars['Upload'];
};


export type MutationImportPageArgs = {
  file: Scalars['Upload'];
};


export type MutationImportProductArgs = {
  file: Scalars['Upload'];
};


export type MutationImportSizeArgs = {
  file: Scalars['Upload'];
};


export type MutationImportStoreArgs = {
  file: Scalars['Upload'];
};


export type MutationImportUserArgs = {
  file: Scalars['Upload'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationNotifyFirebaseArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  device_id?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  platform?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
  user_type?: InputMaybe<Scalars['String']>;
};


export type MutationPaySuccessPageHitArgs = {
  orderId?: InputMaybe<Scalars['ID']>;
  paymentMode?: InputMaybe<Scalars['String']>;
  paymentReferenceId?: InputMaybe<Scalars['String']>;
};


export type MutationPaymentConfirmationArgs = {
  paymentId: Scalars['ID'];
};


export type MutationPaypalCancelArgs = {
  token: Scalars['String'];
};


export type MutationPaypalConfirmationArgs = {
  paymentId: Scalars['String'];
};


export type MutationPaypalExecuteArgs = {
  PayerID: Scalars['String'];
  paymentId: Scalars['String'];
  token?: InputMaybe<Scalars['String']>;
};


export type MutationPaypalPayNowArgs = {
  address?: InputMaybe<Scalars['ID']>;
  slot?: InputMaybe<Scalars['ID']>;
};


export type MutationPaytmCapturePayArgs = {
  oid: Scalars['String'];
  paymentId: Scalars['String'];
};


export type MutationPaytmPayNowArgs = {
  address?: InputMaybe<Scalars['ID']>;
  slot?: InputMaybe<Scalars['ID']>;
};


export type MutationPopulateDemoDataInStoreArgs = {
  storeId?: InputMaybe<Scalars['ID']>;
};


export type MutationPushToNeteaseCdnArgs = {
  cid?: InputMaybe<Scalars['Int']>;
  cname?: InputMaybe<Scalars['String']>;
  layout?: InputMaybe<Scalars['String']>;
  record?: InputMaybe<Scalars['Boolean']>;
  streamUrl?: InputMaybe<Scalars['String']>;
  taskId?: InputMaybe<Scalars['String']>;
  version?: InputMaybe<Scalars['Float']>;
};


export type MutationRazorpayArgs = {
  address?: InputMaybe<Scalars['ID']>;
  slot?: InputMaybe<Scalars['ID']>;
};


export type MutationRegisterArgs = {
  email: Scalars['String'];
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
  phone?: InputMaybe<Scalars['String']>;
  referralCode?: InputMaybe<Scalars['String']>;
  role?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type MutationRemoveAttributeArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveColorArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveCurrencyArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveDealArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveDemoDataInStoreArgs = {
  storeId?: InputMaybe<Scalars['ID']>;
};


export type MutationRemoveFeatureArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveGlobalOptionArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveGlobalOptionValueArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveLanguageArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveLocationArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveOptionArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveOptionValueArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveOrderStatusArgs = {
  id: Scalars['ID'];
};


export type MutationRemovePageArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveReviewArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveShippingMethodArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveSizeArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveSlotArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveStoreCountryArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveStoreCurrencyArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveStoreLanguageArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveUnitArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveUserArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveUserFromStoreArgs = {
  userId: Scalars['ID'];
};


export type MutationRemoveVariantArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveVendorArgs = {
  id: Scalars['ID'];
};


export type MutationRequestAppointmentArgs = {
  email?: InputMaybe<Scalars['String']>;
  event: Scalars['ID'];
  phone?: InputMaybe<Scalars['String']>;
};


export type MutationResendEmailArgs = {
  email?: InputMaybe<Scalars['String']>;
};


export type MutationResetPasswordArgs = {
  id: Scalars['ID'];
  password?: InputMaybe<Scalars['String']>;
  passwordConfirmation?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};


export type MutationReturnOrReplaceArgs = {
  address?: InputMaybe<Scalars['ID']>;
  comment?: InputMaybe<Scalars['String']>;
  orderItemId: Scalars['ID'];
  reason: Scalars['String'];
  requestType: Scalars['String'];
};


export type MutationRtcTokenArgs = {
  channel?: InputMaybe<Scalars['String']>;
  isPublisher?: InputMaybe<Scalars['Boolean']>;
};


export type MutationSaveAddressArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  address?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  district?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  isResidential?: InputMaybe<Scalars['Boolean']>;
  lastName?: InputMaybe<Scalars['String']>;
  lat?: InputMaybe<Scalars['Float']>;
  lng?: InputMaybe<Scalars['Float']>;
  locality?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
  town?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  zip?: InputMaybe<Scalars['String']>;
};


export type MutationSaveAttributeArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  category?: InputMaybe<Scalars['ID']>;
  id?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  show?: InputMaybe<Scalars['Boolean']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type MutationSaveBankTransferArgs = {
  amount?: InputMaybe<Scalars['Float']>;
  id: Scalars['String'];
  paymentMethodId?: InputMaybe<Scalars['String']>;
  reference?: InputMaybe<Scalars['String']>;
  remark?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['ID']>;
  verified?: InputMaybe<Scalars['Boolean']>;
};


export type MutationSaveBannerArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  groupId?: InputMaybe<Scalars['String']>;
  groupTitle?: InputMaybe<Scalars['String']>;
  heading?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  img?: InputMaybe<Scalars['String']>;
  isLinkExternal?: InputMaybe<Scalars['Boolean']>;
  isMobile?: InputMaybe<Scalars['Boolean']>;
  link?: InputMaybe<Scalars['String']>;
  pageId?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['Int']>;
  store?: InputMaybe<Scalars['ID']>;
  type?: InputMaybe<Scalars['String']>;
};


export type MutationSaveBlogArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  content?: InputMaybe<Scalars['String']>;
  excerpt?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  img?: InputMaybe<Scalars['String']>;
  published_at?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title?: InputMaybe<Scalars['String']>;
};


export type MutationSaveBrandArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  banner?: InputMaybe<Scalars['String']>;
  brandId?: InputMaybe<Scalars['String']>;
  facebookUrl?: InputMaybe<Scalars['String']>;
  featured?: InputMaybe<Scalars['Boolean']>;
  googleUrl?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  img?: InputMaybe<Scalars['String']>;
  info?: InputMaybe<Scalars['String']>;
  instaUrl?: InputMaybe<Scalars['String']>;
  linkedinUrl?: InputMaybe<Scalars['String']>;
  meta?: InputMaybe<Scalars['String']>;
  metaDescription?: InputMaybe<Scalars['String']>;
  metaKeywords?: InputMaybe<Scalars['String']>;
  metaTitle?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  parent?: InputMaybe<Scalars['ID']>;
  pinterestUrl?: InputMaybe<Scalars['String']>;
  position?: InputMaybe<Scalars['Int']>;
  slug?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
  twitterUrl?: InputMaybe<Scalars['String']>;
  youtubeUrl?: InputMaybe<Scalars['String']>;
};


export type MutationSaveCategoryArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  banner?: InputMaybe<Scalars['String']>;
  brand?: InputMaybe<Scalars['ID']>;
  categoryId?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  featured?: InputMaybe<Scalars['Boolean']>;
  featuredSort?: InputMaybe<Scalars['Float']>;
  id: Scalars['String'];
  img?: InputMaybe<Scalars['String']>;
  keywords?: InputMaybe<Scalars['String']>;
  level?: InputMaybe<Scalars['Int']>;
  link?: InputMaybe<Scalars['String']>;
  megamenu?: InputMaybe<Scalars['Boolean']>;
  meta?: InputMaybe<Scalars['String']>;
  metaDescription?: InputMaybe<Scalars['String']>;
  metaKeywords?: InputMaybe<Scalars['String']>;
  metaTitle?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  parent?: InputMaybe<Scalars['ID']>;
  position?: InputMaybe<Scalars['Int']>;
  refreshSlug?: InputMaybe<Scalars['Boolean']>;
  shopbycategory?: InputMaybe<Scalars['Boolean']>;
  slug?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type MutationSaveChannelArgs = {
  id: Scalars['String'];
  img?: InputMaybe<Scalars['String']>;
  isLive?: InputMaybe<Scalars['Boolean']>;
  product?: InputMaybe<Scalars['ID']>;
  products?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  scheduleDateTime?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  users?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};


export type MutationSaveCollectionArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  images?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  img?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  products?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  q?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
  type?: InputMaybe<Scalars['String']>;
};


export type MutationSaveColorArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  color_code?: InputMaybe<Scalars['String']>;
  featured?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['String'];
  info?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
  val?: InputMaybe<Scalars['String']>;
};


export type MutationSaveCountryArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  code?: InputMaybe<Scalars['String']>;
  dialCode?: InputMaybe<Scalars['String']>;
  flag?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  img?: InputMaybe<Scalars['String']>;
  lang?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['Int']>;
  value?: InputMaybe<Scalars['String']>;
};


export type MutationSaveCouponArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  code?: InputMaybe<Scalars['String']>;
  color?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  discount?: InputMaybe<DiscountIp>;
  howMany?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['String']>;
  info?: InputMaybe<Scalars['String']>;
  isMultiple?: InputMaybe<Scalars['Boolean']>;
  maxAmount?: InputMaybe<Scalars['Int']>;
  maxUselimit?: InputMaybe<Scalars['Int']>;
  msg?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  oneUsePerCustomer?: InputMaybe<Scalars['Boolean']>;
  oneUsePerUniqueCode?: InputMaybe<Scalars['Boolean']>;
  store?: InputMaybe<Scalars['ID']>;
  terms?: InputMaybe<Scalars['String']>;
  text?: InputMaybe<Scalars['String']>;
  validFrom?: InputMaybe<Scalars['String']>;
  validTo?: InputMaybe<Scalars['String']>;
};


export type MutationSaveCurrencyArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  decimalDigits?: InputMaybe<Scalars['Int']>;
  decimalMark?: InputMaybe<Scalars['String']>;
  disambiguateSymbol?: InputMaybe<Scalars['String']>;
  htmlEntity?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  isoCode?: InputMaybe<Scalars['String']>;
  isoNumericCode?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  smallestDenomination?: InputMaybe<Scalars['Float']>;
  sort?: InputMaybe<Scalars['Int']>;
  subUnit?: InputMaybe<Scalars['String']>;
  subunitToUnit?: InputMaybe<Scalars['Float']>;
  symbol?: InputMaybe<Scalars['String']>;
  symbolFirst?: InputMaybe<Scalars['Boolean']>;
  thousandsSeparator?: InputMaybe<Scalars['String']>;
};


export type MutationSaveCustomerMessageArgs = {
  email?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  message?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type MutationSaveDealArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  dealStatus?: InputMaybe<Scalars['Boolean']>;
  description?: InputMaybe<Scalars['String']>;
  endTime?: InputMaybe<Scalars['String']>;
  endTimeISO?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  img?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  onGoing?: InputMaybe<Scalars['Boolean']>;
  products?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  startTime?: InputMaybe<Scalars['String']>;
  startTimeISO?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type MutationSaveDiscountArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  amount?: InputMaybe<Scalars['Float']>;
  applyOn?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  endDate?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  img?: InputMaybe<Scalars['String']>;
  maximumUsage?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  numberOfTimeUsed?: InputMaybe<Scalars['Int']>;
  q?: InputMaybe<Scalars['String']>;
  ruleType?: InputMaybe<Scalars['String']>;
  seller?: InputMaybe<Scalars['ID']>;
  startDate?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};


export type MutationSaveEventArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['String'];
  rules?: InputMaybe<Array<InputMaybe<RuleIp>>>;
};


export type MutationSaveFaqArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  answer?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  opened?: InputMaybe<Scalars['Boolean']>;
  question?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
  topic?: InputMaybe<Scalars['String']>;
};


export type MutationSaveFaqTopicArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  for?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
};


export type MutationSaveFcmTokenArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  device_id?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  platform?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};


export type MutationSaveFeatureArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  product?: InputMaybe<Scalars['ID']>;
  store?: InputMaybe<Scalars['ID']>;
  type?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};


export type MutationSaveGlobalOptionArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  categories?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  id: Scalars['String'];
  info?: InputMaybe<Scalars['String']>;
  isFilter?: InputMaybe<Scalars['Boolean']>;
  key?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  position?: InputMaybe<Scalars['Int']>;
  preselect?: InputMaybe<Scalars['Boolean']>;
  required?: InputMaybe<Scalars['Boolean']>;
  slug?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  val?: InputMaybe<Scalars['String']>;
};


export type MutationSaveGlobalOptionValueArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  default?: InputMaybe<Scalars['Boolean']>;
  global_option_id?: InputMaybe<Scalars['ID']>;
  id: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  position?: InputMaybe<Scalars['Int']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type MutationSaveInfluencerArgs = {
  id: Scalars['String'];
  product?: InputMaybe<Scalars['ID']>;
  videos?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type MutationSaveInventoryArgs = {
  action: Scalars['String'];
  notes?: InputMaybe<Scalars['String']>;
  product: Scalars['ID'];
  quantity?: InputMaybe<Scalars['Int']>;
  reason?: InputMaybe<Scalars['String']>;
};


export type MutationSaveLanguageArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  code?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  nativeName?: InputMaybe<Scalars['String']>;
  phpLocaleCode?: InputMaybe<Scalars['String']>;
  rtl?: InputMaybe<Scalars['Boolean']>;
  sort?: InputMaybe<Scalars['Int']>;
};


export type MutationSaveLocationArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  country?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  lat?: InputMaybe<Scalars['Float']>;
  lng?: InputMaybe<Scalars['Float']>;
  name?: InputMaybe<Scalars['String']>;
  zip?: InputMaybe<Scalars['String']>;
  zips?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type MutationSaveMyVendorArgs = {
  about?: InputMaybe<Scalars['String']>;
  address?: InputMaybe<Scalars['ID']>;
  bankAccountHolderName?: InputMaybe<Scalars['String']>;
  bankAccountNo?: InputMaybe<Scalars['Float']>;
  bankIfsc?: InputMaybe<Scalars['String']>;
  bankName?: InputMaybe<Scalars['String']>;
  bankSwiftCode?: InputMaybe<Scalars['String']>;
  banner?: InputMaybe<Scalars['String']>;
  banners?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  businessName?: InputMaybe<Scalars['String']>;
  categories?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  commissionType?: InputMaybe<Scalars['String']>;
  commissionValue?: InputMaybe<Scalars['Float']>;
  description?: InputMaybe<Scalars['String']>;
  facebookUrl?: InputMaybe<Scalars['String']>;
  freeShippingOn?: InputMaybe<Scalars['Float']>;
  githubUrl?: InputMaybe<Scalars['String']>;
  googleUrl?: InputMaybe<Scalars['String']>;
  info?: InputMaybe<InputInfo>;
  meta?: InputMaybe<Scalars['String']>;
  metaDescription?: InputMaybe<Scalars['String']>;
  metaKeywords?: InputMaybe<Scalars['String']>;
  metaTitle?: InputMaybe<Scalars['String']>;
  shippingCharges?: InputMaybe<Scalars['Float']>;
  twitterUrl?: InputMaybe<Scalars['String']>;
};


export type MutationSaveOptionArgs = {
  id?: InputMaybe<Scalars['String']>;
  inputType?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  position?: InputMaybe<Scalars['Int']>;
  preselectDefault?: InputMaybe<Scalars['Boolean']>;
  product?: InputMaybe<Scalars['ID']>;
  required?: InputMaybe<Scalars['Boolean']>;
};


export type MutationSaveOptionValueArgs = {
  default?: InputMaybe<Scalars['Boolean']>;
  direction?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  isPercent?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  option?: InputMaybe<Scalars['ID']>;
  position?: InputMaybe<Scalars['Int']>;
  value?: InputMaybe<Scalars['Float']>;
};


export type MutationSaveOrderStatusArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  courier_name?: InputMaybe<Scalars['String']>;
  event?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  item?: InputMaybe<Scalars['ID']>;
  order?: InputMaybe<Scalars['ID']>;
  tracking_id?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};


export type MutationSavePageArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  content?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  keywords?: InputMaybe<Scalars['String']>;
  menuTitle?: InputMaybe<Scalars['String']>;
  metaDescription?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};


export type MutationSavePaymentMethodArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  color?: InputMaybe<Scalars['String']>;
  featured?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['String'];
  img?: InputMaybe<Scalars['String']>;
  instructions?: InputMaybe<Scalars['String']>;
  key?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  position?: InputMaybe<Scalars['Int']>;
  qrcode?: InputMaybe<Scalars['String']>;
  text?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};


export type MutationSavePopularSearchArgs = {
  id: Scalars['String'];
  popularity?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
  text?: InputMaybe<Scalars['String']>;
};


export type MutationSaveProductArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  ageMax?: InputMaybe<Scalars['Int']>;
  ageMin?: InputMaybe<Scalars['Int']>;
  ageUnit?: InputMaybe<Scalars['String']>;
  articleCode?: InputMaybe<Scalars['String']>;
  availability?: InputMaybe<Scalars['String']>;
  barcode?: InputMaybe<Scalars['String']>;
  batchNo?: InputMaybe<Scalars['String']>;
  brand?: InputMaybe<Scalars['ID']>;
  categories?: InputMaybe<Array<Scalars['ID']>>;
  category?: InputMaybe<Scalars['ID']>;
  cgst?: InputMaybe<Scalars['Float']>;
  collections?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  colorCode?: InputMaybe<Scalars['String']>;
  colorGroup?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  colorName?: InputMaybe<Scalars['String']>;
  condition?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['ID']>;
  countryOfOrigin?: InputMaybe<Scalars['String']>;
  currency?: InputMaybe<Scalars['String']>;
  deliveryDetails?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  dimensionUnit?: InputMaybe<Scalars['String']>;
  eanNo?: InputMaybe<Scalars['String']>;
  expiryDate?: InputMaybe<Scalars['String']>;
  featured?: InputMaybe<Scalars['Boolean']>;
  files?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  foodType?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<Scalars['String']>;
  group?: InputMaybe<Scalars['String']>;
  gtin?: InputMaybe<Scalars['String']>;
  height?: InputMaybe<Scalars['Float']>;
  hot?: InputMaybe<Scalars['Boolean']>;
  hsn?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  igst?: InputMaybe<Scalars['Float']>;
  images?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  img?: InputMaybe<Scalars['String']>;
  isCod?: InputMaybe<Scalars['Boolean']>;
  isSearchable?: InputMaybe<Scalars['Boolean']>;
  isUnlimited?: InputMaybe<Scalars['Boolean']>;
  itemId?: InputMaybe<Scalars['String']>;
  keywords?: InputMaybe<Scalars['String']>;
  lat?: InputMaybe<Scalars['Float']>;
  length?: InputMaybe<Scalars['Float']>;
  link?: InputMaybe<Scalars['String']>;
  lng?: InputMaybe<Scalars['Float']>;
  manufacturer?: InputMaybe<Scalars['String']>;
  maxOrderQty?: InputMaybe<Scalars['Int']>;
  metaDescription?: InputMaybe<Scalars['String']>;
  metaTitle?: InputMaybe<Scalars['String']>;
  mfgDate?: InputMaybe<Scalars['String']>;
  minOrderQty?: InputMaybe<Scalars['Int']>;
  mrp?: InputMaybe<Scalars['Float']>;
  name?: InputMaybe<Scalars['String']>;
  new?: InputMaybe<Scalars['Boolean']>;
  parentBrand?: InputMaybe<Scalars['ID']>;
  popularity?: InputMaybe<Scalars['Int']>;
  position?: InputMaybe<Scalars['Int']>;
  preOrder?: InputMaybe<Scalars['Boolean']>;
  price?: InputMaybe<Scalars['Float']>;
  productMasterId?: InputMaybe<Scalars['String']>;
  recommended?: InputMaybe<Scalars['Boolean']>;
  relatedProducts?: InputMaybe<Array<Scalars['ID']>>;
  replaceAllowed?: InputMaybe<Scalars['Boolean']>;
  replaceValidityInDays?: InputMaybe<Scalars['Int']>;
  returnAllowed?: InputMaybe<Scalars['Boolean']>;
  returnInfo?: InputMaybe<Scalars['String']>;
  returnValidityInDays?: InputMaybe<Scalars['Int']>;
  sale?: InputMaybe<Scalars['Boolean']>;
  sgst?: InputMaybe<Scalars['Float']>;
  shippingCost?: InputMaybe<Scalars['Float']>;
  size?: InputMaybe<Scalars['ID']>;
  sizeGroup?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  sizechart?: InputMaybe<Scalars['String']>;
  sku?: InputMaybe<Scalars['String']>;
  slots?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  slug?: InputMaybe<Scalars['String']>;
  specifications?: InputMaybe<Array<Scalars['ID']>>;
  stock?: InputMaybe<Scalars['Int']>;
  store?: InputMaybe<Scalars['ID']>;
  styleCode?: InputMaybe<Scalars['String']>;
  styleId?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  tax?: InputMaybe<Scalars['Float']>;
  time?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  trackInventory?: InputMaybe<Scalars['Boolean']>;
  trending?: InputMaybe<Scalars['Boolean']>;
  type?: InputMaybe<Scalars['String']>;
  unit?: InputMaybe<Scalars['String']>;
  variants?: InputMaybe<Array<Scalars['ID']>>;
  warranty?: InputMaybe<Scalars['String']>;
  weight?: InputMaybe<Scalars['Float']>;
  width?: InputMaybe<Scalars['Float']>;
  zips?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type MutationSavePromotionArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  description?: InputMaybe<Scalars['String']>;
  discount?: InputMaybe<DiscountIp>;
  featured?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['String']>;
  img?: InputMaybe<Scalars['String']>;
  maxAmount?: InputMaybe<Scalars['Int']>;
  maxUselimit?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  oneUsePerCustomer?: InputMaybe<Scalars['Boolean']>;
  platform?: InputMaybe<Scalars['String']>;
  priority?: InputMaybe<Scalars['Int']>;
  store?: InputMaybe<Scalars['ID']>;
  validFrom?: InputMaybe<Scalars['String']>;
  validTo?: InputMaybe<Scalars['String']>;
};


export type MutationSaveReferralArgs = {
  id: Scalars['String'];
  referredFrom?: InputMaybe<Scalars['ID']>;
  referredTo?: InputMaybe<Scalars['ID']>;
  storeCreated?: InputMaybe<Scalars['Boolean']>;
  subscribe?: InputMaybe<Scalars['ID']>;
  subscriptionBought?: InputMaybe<Scalars['Boolean']>;
};


export type MutationSaveReviewArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['String'];
  message?: InputMaybe<Scalars['String']>;
  pid?: InputMaybe<Scalars['ID']>;
  rating?: InputMaybe<Scalars['Int']>;
  store?: InputMaybe<Scalars['ID']>;
  user?: InputMaybe<Scalars['ID']>;
  variant?: InputMaybe<Scalars['ID']>;
};


export type MutationSaveRoleArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  roles?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type MutationSaveScheduleDemoArgs = {
  id: Scalars['String'];
  img?: InputMaybe<Scalars['String']>;
  product?: InputMaybe<Scalars['ID']>;
  products?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  scheduleDateTime?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  users?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};


export type MutationSaveSettingsArgs = {
  CASHFREE_KEY_ID?: InputMaybe<Scalars['String']>;
  CDN_URL?: InputMaybe<Scalars['String']>;
  RAZORPAY_KEY_ID?: InputMaybe<Scalars['String']>;
  adminNotifications?: InputMaybe<AdminNotificationIp>;
  alert?: InputMaybe<Scalars['String']>;
  brainTreePublicKey?: InputMaybe<Scalars['String']>;
  closed?: InputMaybe<Scalars['Boolean']>;
  closedMessage?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['ID']>;
  currency?: InputMaybe<Scalars['ID']>;
  currencyCode?: InputMaybe<Scalars['String']>;
  currencyDecimals?: InputMaybe<Scalars['Int']>;
  currencySymbol?: InputMaybe<Scalars['String']>;
  customerOrderNotifications?: InputMaybe<UserNotificationIp>;
  demo?: InputMaybe<Scalars['Boolean']>;
  description?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<EmailIp>;
  enableRazorpay?: InputMaybe<Scalars['Boolean']>;
  enableStripe?: InputMaybe<Scalars['Boolean']>;
  enableSubsription?: InputMaybe<Scalars['Boolean']>;
  enableTax?: InputMaybe<Scalars['Boolean']>;
  enableZips?: InputMaybe<Scalars['Boolean']>;
  facebook?: InputMaybe<Scalars['String']>;
  favicon?: InputMaybe<Scalars['String']>;
  google?: InputMaybe<Scalars['String']>;
  googleMapsApi?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  instagram?: InputMaybe<Scalars['String']>;
  isMegamenu?: InputMaybe<Scalars['Boolean']>;
  isMultiStore?: InputMaybe<Scalars['Boolean']>;
  isMultiVendor?: InputMaybe<Scalars['Boolean']>;
  isSaas?: InputMaybe<Scalars['Boolean']>;
  isSearch?: InputMaybe<Scalars['Boolean']>;
  isVerifyEmail?: InputMaybe<Scalars['Boolean']>;
  joiningBonus?: InputMaybe<Scalars['Float']>;
  keywords?: InputMaybe<Scalars['String']>;
  lang?: InputMaybe<Scalars['ID']>;
  linkedin?: InputMaybe<Scalars['String']>;
  liveCommerce?: InputMaybe<Scalars['Boolean']>;
  locationExpiry?: InputMaybe<Scalars['Float']>;
  login?: InputMaybe<LoginSettingIp>;
  logo?: InputMaybe<Scalars['String']>;
  logoDark?: InputMaybe<Scalars['String']>;
  logoMobile?: InputMaybe<Scalars['String']>;
  logoMobileDark?: InputMaybe<Scalars['String']>;
  minimumOrderValue?: InputMaybe<Scalars['Int']>;
  multilingual?: InputMaybe<Scalars['Boolean']>;
  openGraphImage?: InputMaybe<Scalars['String']>;
  orderStatuses?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  otpLogin?: InputMaybe<Scalars['Boolean']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  paymentStatuses?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  product?: InputMaybe<ProductSettingIp>;
  referralBonus?: InputMaybe<Scalars['Float']>;
  review?: InputMaybe<ReviewSettingIp>;
  searchbarText?: InputMaybe<Scalars['String']>;
  shipping?: InputMaybe<ShippingIp>;
  shopAddress?: InputMaybe<Scalars['String']>;
  shopPhone?: InputMaybe<Scalars['String']>;
  sms?: InputMaybe<SmsIp>;
  storage?: InputMaybe<StorageIp>;
  storageProvider?: InputMaybe<Scalars['String']>;
  stripePublishableKey?: InputMaybe<Scalars['String']>;
  tax?: InputMaybe<TaxIp>;
  title?: InputMaybe<Scalars['String']>;
  twitter?: InputMaybe<Scalars['String']>;
  walletThreshold?: InputMaybe<Scalars['Float']>;
  websiteEmail?: InputMaybe<Scalars['String']>;
  websiteLegalName?: InputMaybe<Scalars['String']>;
  websiteName?: InputMaybe<Scalars['String']>;
  zips?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type MutationSaveShippingMethodArgs = {
  amount?: InputMaybe<Scalars['Float']>;
  carrierName?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  maxWeight?: InputMaybe<Scalars['Float']>;
  method?: InputMaybe<Scalars['String']>;
  minWeight?: InputMaybe<Scalars['Float']>;
  shippingNameAtCheckout?: InputMaybe<Scalars['String']>;
  tableBasedOn?: InputMaybe<Scalars['String']>;
};


export type MutationSaveSizeArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  featured?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['String'];
  img?: InputMaybe<Scalars['String']>;
  info?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['Float']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type MutationSaveSlotArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['String'];
  info?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};


export type MutationSaveStateArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  code?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['ID']>;
  flag?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  img?: InputMaybe<Scalars['String']>;
  lang?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['Int']>;
  states?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};


export type MutationSaveStoreArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  address?: InputMaybe<Scalars['String']>;
  adminNotifications?: InputMaybe<AdminNotificationIp>;
  alert?: InputMaybe<Scalars['String']>;
  analyticsTrackingId?: InputMaybe<Scalars['String']>;
  bankAccountHolderName?: InputMaybe<Scalars['String']>;
  bankAccountNo?: InputMaybe<Scalars['String']>;
  bankIfscCode?: InputMaybe<Scalars['String']>;
  bankSwiftCode?: InputMaybe<Scalars['String']>;
  banners?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  city?: InputMaybe<Scalars['String']>;
  closed?: InputMaybe<Scalars['Boolean']>;
  closedMessage?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['ID']>;
  currency?: InputMaybe<Scalars['ID']>;
  currencyCode?: InputMaybe<Scalars['String']>;
  currencyDecimals?: InputMaybe<Scalars['Float']>;
  currencySuffix?: InputMaybe<Scalars['String']>;
  currencySymbol?: InputMaybe<Scalars['String']>;
  customerOrderNotifications?: InputMaybe<UserNotificationIp>;
  description?: InputMaybe<Scalars['String']>;
  dimentionUnit?: InputMaybe<Scalars['String']>;
  domain?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  facebook?: InputMaybe<Scalars['String']>;
  facebookPixelId?: InputMaybe<Scalars['String']>;
  facebookUrl?: InputMaybe<Scalars['String']>;
  favicon?: InputMaybe<Scalars['String']>;
  featured?: InputMaybe<Scalars['Boolean']>;
  firstName?: InputMaybe<Scalars['String']>;
  freeShippingOn?: InputMaybe<Scalars['Float']>;
  gdpr?: InputMaybe<Scalars['Boolean']>;
  gdprCookieConsent?: InputMaybe<Scalars['String']>;
  google?: InputMaybe<Scalars['String']>;
  googleAdsTag?: InputMaybe<Scalars['String']>;
  hideDecimalInCurrency?: InputMaybe<Scalars['Boolean']>;
  homeMeta1?: InputMaybe<Scalars['String']>;
  homeMeta2?: InputMaybe<Scalars['String']>;
  homeMeta3?: InputMaybe<Scalars['String']>;
  homeMeta4?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  images?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  img?: InputMaybe<Scalars['String']>;
  instagram?: InputMaybe<Scalars['String']>;
  instagramUrl?: InputMaybe<Scalars['String']>;
  isCart?: InputMaybe<Scalars['Boolean']>;
  isFnb?: InputMaybe<Scalars['Boolean']>;
  isHideNilStock?: InputMaybe<Scalars['Boolean']>;
  isHyperlocal?: InputMaybe<Scalars['Boolean']>;
  isMegamenu?: InputMaybe<Scalars['Boolean']>;
  isOpen?: InputMaybe<Scalars['Boolean']>;
  isSearch?: InputMaybe<Scalars['Boolean']>;
  isWishlist?: InputMaybe<Scalars['Boolean']>;
  keywords?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  lat?: InputMaybe<Scalars['Float']>;
  legalName?: InputMaybe<Scalars['String']>;
  linkedin?: InputMaybe<Scalars['String']>;
  lng?: InputMaybe<Scalars['Float']>;
  locality?: InputMaybe<Scalars['String']>;
  logo?: InputMaybe<Scalars['String']>;
  logoDark?: InputMaybe<Scalars['String']>;
  logoMobile?: InputMaybe<Scalars['String']>;
  logoMobileDark?: InputMaybe<Scalars['String']>;
  metaDescription?: InputMaybe<Scalars['String']>;
  minOrderValue?: InputMaybe<Scalars['Float']>;
  minimumOrderValue?: InputMaybe<Scalars['Float']>;
  name?: InputMaybe<Scalars['String']>;
  openGraphImage?: InputMaybe<Scalars['String']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  phone?: InputMaybe<Scalars['String']>;
  pickrrAuthToken?: InputMaybe<Scalars['String']>;
  pinterestTag?: InputMaybe<Scalars['String']>;
  pinterestUrl?: InputMaybe<Scalars['String']>;
  priceDisplayFormat?: InputMaybe<Scalars['String']>;
  qrCode?: InputMaybe<Scalars['String']>;
  refreshSlug?: InputMaybe<Scalars['Boolean']>;
  review?: InputMaybe<ReviewSettingIp>;
  searchbarText?: InputMaybe<Scalars['String']>;
  shipRocketChannelId?: InputMaybe<Scalars['String']>;
  shipRocketEmail?: InputMaybe<Scalars['String']>;
  shipRocketPassword?: InputMaybe<Scalars['String']>;
  shipping?: InputMaybe<ShippingIp>;
  shippingCharge?: InputMaybe<Scalars['Float']>;
  shippoToken?: InputMaybe<Scalars['String']>;
  shopAddress?: InputMaybe<Scalars['String']>;
  shopPhone?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  sms?: InputMaybe<SmsIp>;
  snapChatPixel?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  storeId?: InputMaybe<Scalars['String']>;
  timeDisplayFormat?: InputMaybe<Scalars['String']>;
  timeZone?: InputMaybe<Scalars['String']>;
  timing?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  twitter?: InputMaybe<Scalars['String']>;
  twitterUrl?: InputMaybe<Scalars['String']>;
  vendorNotifications?: InputMaybe<VendorNotificationIp>;
  webmail?: InputMaybe<Scalars['String']>;
  websiteEmail?: InputMaybe<Scalars['String']>;
  websiteLegalName?: InputMaybe<Scalars['String']>;
  websiteName?: InputMaybe<Scalars['String']>;
  weightUnit?: InputMaybe<Scalars['String']>;
  youtubeUrl?: InputMaybe<Scalars['String']>;
  zip?: InputMaybe<Scalars['String']>;
};


export type MutationSaveStoreCountryArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  country?: InputMaybe<Scalars['ID']>;
  default?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['String'];
};


export type MutationSaveStoreCurrencyArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  conversionMode?: InputMaybe<Scalars['String']>;
  conversionRate?: InputMaybe<Scalars['Float']>;
  currency?: InputMaybe<Scalars['ID']>;
  decimalDigits?: InputMaybe<Scalars['Int']>;
  default?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['String'];
};


export type MutationSaveStoreLanguageArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  default?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['String'];
  lang?: InputMaybe<Scalars['ID']>;
};


export type MutationSaveSubscriptionArgs = {
  abandonnedCartRecovery?: InputMaybe<Scalars['Boolean']>;
  active?: InputMaybe<Scalars['Boolean']>;
  annualPrice?: InputMaybe<Scalars['Float']>;
  appointments?: InputMaybe<Scalars['Boolean']>;
  callMeLimit?: InputMaybe<Scalars['Int']>;
  cashfreePlanId?: InputMaybe<Scalars['String']>;
  chatSupport?: InputMaybe<Scalars['Boolean']>;
  customDomain?: InputMaybe<Scalars['Boolean']>;
  delivery?: InputMaybe<Scalars['Boolean']>;
  description?: InputMaybe<Scalars['String']>;
  discountCoupons?: InputMaybe<Scalars['Boolean']>;
  emailSupport?: InputMaybe<Scalars['Boolean']>;
  expertConsultation?: InputMaybe<Scalars['String']>;
  freeSSL?: InputMaybe<Scalars['Boolean']>;
  homepageAdvertise?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  maxAdminAllowed?: InputMaybe<Scalars['Int']>;
  misReports?: InputMaybe<Scalars['Boolean']>;
  monthlyPrice?: InputMaybe<Scalars['Float']>;
  name?: InputMaybe<Scalars['String']>;
  onlineStore?: InputMaybe<Scalars['Boolean']>;
  photosAllowed?: InputMaybe<Scalars['Int']>;
  pickup?: InputMaybe<Scalars['Boolean']>;
  premiumSupport?: InputMaybe<Scalars['Boolean']>;
  productImportExport?: InputMaybe<Scalars['Boolean']>;
  productsAllowed?: InputMaybe<Scalars['Int']>;
  removeMisikiLogo?: InputMaybe<Scalars['Boolean']>;
  salesChannels?: InputMaybe<Scalars['Boolean']>;
  seoOptions?: InputMaybe<Scalars['Boolean']>;
  stripePlanId?: InputMaybe<Scalars['String']>;
  tableBooking?: InputMaybe<Scalars['Boolean']>;
  title?: InputMaybe<Scalars['String']>;
  transactionFees?: InputMaybe<Scalars['Float']>;
  transactionFeesType?: InputMaybe<Scalars['String']>;
  unlimitedProducts?: InputMaybe<Scalars['Boolean']>;
  unlimitedValidity?: InputMaybe<Scalars['Boolean']>;
};


export type MutationSaveTagArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  colorCode?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type MutationSaveTemplateArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  content?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  fileName?: InputMaybe<Scalars['String']>;
  icon?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
  title?: InputMaybe<Scalars['String']>;
  variables?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type MutationSaveUnitArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  featured?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['String'];
  img?: InputMaybe<Scalars['String']>;
  info?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type MutationSaveUserArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  avatar?: InputMaybe<Scalars['String']>;
  banner?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  freeShippingOn?: InputMaybe<Scalars['Int']>;
  gender?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  lastName?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
  role?: InputMaybe<Scalars['String']>;
  roles?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  shippingCharges?: InputMaybe<Scalars['Int']>;
  state?: InputMaybe<Scalars['String']>;
  storeCommissionType?: InputMaybe<Scalars['String']>;
  storeCommissionValue?: InputMaybe<Scalars['Float']>;
  storeName?: InputMaybe<Scalars['String']>;
  verified?: InputMaybe<Scalars['Boolean']>;
  zip?: InputMaybe<Scalars['Int']>;
};


export type MutationSaveVariantArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  barcode?: InputMaybe<Scalars['String']>;
  height?: InputMaybe<Scalars['Float']>;
  id?: InputMaybe<Scalars['String']>;
  images?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  img?: InputMaybe<Scalars['String']>;
  length?: InputMaybe<Scalars['Float']>;
  mrp?: InputMaybe<Scalars['Float']>;
  name?: InputMaybe<Scalars['String']>;
  options?: InputMaybe<Array<InputMaybe<OptionIp>>>;
  pid: Scalars['ID'];
  price?: InputMaybe<Scalars['Float']>;
  sku?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['Int']>;
  stock?: InputMaybe<Scalars['Float']>;
  trackInventory?: InputMaybe<Scalars['Boolean']>;
  weight?: InputMaybe<Scalars['Float']>;
  width?: InputMaybe<Scalars['Float']>;
};


export type MutationSaveVendorArgs = {
  address?: InputMaybe<Scalars['ID']>;
  bankAccountHolderName?: InputMaybe<Scalars['String']>;
  bankAccountNo?: InputMaybe<Scalars['Float']>;
  bankIfsc?: InputMaybe<Scalars['String']>;
  bankName?: InputMaybe<Scalars['String']>;
  bankSwiftCode?: InputMaybe<Scalars['String']>;
  banner?: InputMaybe<Scalars['String']>;
  businessName?: InputMaybe<Scalars['String']>;
  categories?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  commissionType?: InputMaybe<Scalars['String']>;
  commissionValue?: InputMaybe<Scalars['Float']>;
  description?: InputMaybe<Scalars['String']>;
  facebookUrl?: InputMaybe<Scalars['String']>;
  freeShippingOn?: InputMaybe<Scalars['Float']>;
  githubUrl?: InputMaybe<Scalars['String']>;
  googleUrl?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  info?: InputMaybe<InputInfo>;
  meta?: InputMaybe<Scalars['String']>;
  metaDescription?: InputMaybe<Scalars['String']>;
  metaKeywords?: InputMaybe<Scalars['String']>;
  metaTitle?: InputMaybe<Scalars['String']>;
  shippingCharges?: InputMaybe<Scalars['Float']>;
  twitterUrl?: InputMaybe<Scalars['String']>;
  verified?: InputMaybe<Scalars['Boolean']>;
};


export type MutationSaveVideoArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  board?: InputMaybe<Scalars['ID']>;
  category?: InputMaybe<Scalars['String']>;
  chapter?: InputMaybe<Scalars['String']>;
  class?: InputMaybe<Scalars['ID']>;
  comment?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  difficulty?: InputMaybe<Scalars['String']>;
  featured?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['String'];
  img?: InputMaybe<Scalars['String']>;
  lang?: InputMaybe<Scalars['String']>;
  level?: InputMaybe<Scalars['ID']>;
  meta?: InputMaybe<Scalars['String']>;
  metaDescription?: InputMaybe<Scalars['String']>;
  metaKeywords?: InputMaybe<Scalars['String']>;
  metaTitle?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['Int']>;
  status?: InputMaybe<Scalars['String']>;
  subject?: InputMaybe<Scalars['ID']>;
  taskId?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['ID']>;
  vid?: InputMaybe<Scalars['String']>;
  videoId?: InputMaybe<Scalars['String']>;
};


export type MutationSendInstantMessageArgs = {
  channel: Scalars['String'];
  message?: InputMaybe<Scalars['String']>;
};


export type MutationSendInvitationArgs = {
  emails?: InputMaybe<Scalars['String']>;
};


export type MutationSignInWithAppleArgs = {
  code: Scalars['String'];
};


export type MutationSingleUploadArgs = {
  file: Scalars['Upload'];
  folder?: InputMaybe<Scalars['String']>;
  productId?: InputMaybe<Scalars['ID']>;
};


export type MutationStripeArgs = {
  address?: InputMaybe<Scalars['ID']>;
  paymentMethodId?: InputMaybe<Scalars['String']>;
  slot?: InputMaybe<Scalars['ID']>;
};


export type MutationStripeCancelArgs = {
  paymentIntentId: Scalars['String'];
};


export type MutationStripeCaptureArgs = {
  paymentIntentId: Scalars['String'];
};


export type MutationStripeMobileArgs = {
  address?: InputMaybe<Scalars['ID']>;
  slot?: InputMaybe<Scalars['ID']>;
};


export type MutationStripeSubscriptionArgs = {
  intervalType?: InputMaybe<Scalars['String']>;
  paymentMethodId?: InputMaybe<Scalars['String']>;
  subscription: Scalars['ID'];
};


export type MutationSyncOrderItemWithShippingArgs = {
  orderItems?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};


export type MutationToggleWishlistArgs = {
  product: Scalars['ID'];
  variant: Scalars['ID'];
};


export type MutationUpdateAllStoreDataArgs = {
  type?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateAddressArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  address?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  deliveryInstructions?: InputMaybe<Scalars['String']>;
  district?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  isResidential?: InputMaybe<Scalars['Boolean']>;
  lastName?: InputMaybe<Scalars['String']>;
  lat?: InputMaybe<Scalars['Float']>;
  lng?: InputMaybe<Scalars['Float']>;
  locality?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
  town?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  zip?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateAllVendorArgs = {
  force?: InputMaybe<Scalars['Boolean']>;
  password: Scalars['String'];
};


export type MutationUpdateAppointmentArgs = {
  id: Scalars['ID'];
  status?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateDealArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  dealStatus?: InputMaybe<Scalars['Boolean']>;
  description?: InputMaybe<Scalars['String']>;
  endTime?: InputMaybe<Scalars['String']>;
  endTimeISO?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  onGoing?: InputMaybe<Scalars['Boolean']>;
  products?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  startTime?: InputMaybe<Scalars['String']>;
  startTimeISO?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type MutationUpdateOrderArgs = {
  courierName?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  pid: Scalars['ID'];
  returnCourierName?: InputMaybe<Scalars['String']>;
  returnTrackingId?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  tracking?: InputMaybe<Scalars['String']>;
  trackingId?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateOrderItemArgs = {
  courierName?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  returnCourierName?: InputMaybe<Scalars['String']>;
  returnTrackingId?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  tracking?: InputMaybe<Scalars['String']>;
  trackingId?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateProfileArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  address?: InputMaybe<AddressInput>;
  avatar?: InputMaybe<Scalars['String']>;
  banner?: InputMaybe<Scalars['String']>;
  dob?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  freeShippingOn?: InputMaybe<Scalars['Int']>;
  gender?: InputMaybe<Scalars['String']>;
  info?: InputMaybe<InputInfo>;
  lastName?: InputMaybe<Scalars['String']>;
  meta?: InputMaybe<Scalars['String']>;
  metaDescription?: InputMaybe<Scalars['String']>;
  metaKeywords?: InputMaybe<Scalars['String']>;
  metaTitle?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
  provider?: InputMaybe<Scalars['String']>;
  role?: InputMaybe<Scalars['String']>;
  shippingCharges?: InputMaybe<Scalars['Int']>;
  storeName?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateShippoDataArgs = {
  orderItemId?: InputMaybe<Scalars['ID']>;
};


export type MutationUpdateStoreTimingArgs = {
  day?: InputMaybe<Scalars['String']>;
  fromTime?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  index?: InputMaybe<Scalars['Int']>;
  isOpen?: InputMaybe<Scalars['Boolean']>;
  online?: InputMaybe<Scalars['Boolean']>;
  toTime?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateVisitorCountArgs = {
  store: Scalars['ID'];
};


export type MutationUpdateWithdrawalArgs = {
  id: Scalars['ID'];
  remark?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
};


export type MutationUploadVideoArgs = {
  files?: InputMaybe<Array<Scalars['Upload']>>;
  folder?: InputMaybe<Scalars['String']>;
};


export type MutationVendorVerificationArgs = {
  country?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  store?: InputMaybe<Scalars['ID']>;
  verified?: InputMaybe<Scalars['Boolean']>;
  zip?: InputMaybe<Scalars['String']>;
  zips?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type MutationVerifyEmailArgs = {
  expires: Scalars['String'];
  id: Scalars['ID'];
  signature: Scalars['String'];
  store?: InputMaybe<Scalars['ID']>;
  token: Scalars['String'];
};


export type MutationVerifyOtpArgs = {
  otp: Scalars['String'];
  phone: Scalars['String'];
  store?: InputMaybe<Scalars['ID']>;
};


export type MutationWithdrawalAmountArgs = {
  amount: Scalars['Float'];
};

export type NameVal = {
  __typename?: 'NameVal';
  name?: Maybe<Scalars['String']>;
  val?: Maybe<Scalars['String']>;
};

export type NameValImg = {
  __typename?: 'NameValImg';
  img?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  val?: Maybe<Scalars['String']>;
};

export type NameValIp = {
  name?: InputMaybe<Scalars['String']>;
  val?: InputMaybe<Scalars['String']>;
};

export type NameValue = {
  __typename?: 'NameValue';
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type NeteaseVideo = {
  __typename?: 'NeteaseVideo';
  createTime?: Maybe<Scalars['String']>;
  downloadOrigUrl?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['Int']>;
  durationMsec?: Maybe<Scalars['Int']>;
  initialSize?: Maybe<Scalars['Int']>;
  origUrl?: Maybe<Scalars['String']>;
  playSupport?: Maybe<Scalars['Int']>;
  snapshotUrl?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['Int']>;
  typeId?: Maybe<Scalars['Int']>;
  typeName?: Maybe<Scalars['String']>;
  updateTime?: Maybe<Scalars['String']>;
  vid?: Maybe<Scalars['String']>;
  videoName?: Maybe<Scalars['String']>;
};

export type OneAddress = {
  __typename?: 'OneAddress';
  active?: Maybe<Scalars['Boolean']>;
  address?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  district?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  fullName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isResidential?: Maybe<Scalars['Boolean']>;
  lastName?: Maybe<Scalars['String']>;
  lat?: Maybe<Scalars['Float']>;
  lng?: Maybe<Scalars['Float']>;
  locality?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  store?: Maybe<Scalars['ID']>;
  town?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  user?: Maybe<Scalars['ID']>;
  verified?: Maybe<Scalars['Boolean']>;
  zip?: Maybe<Scalars['String']>;
};

export type OneAppointment = {
  __typename?: 'OneAppointment';
  createdAt: Scalars['String'];
  date?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  event?: Maybe<Scalars['ID']>;
  from?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  phone?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  to?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  uid?: Maybe<Scalars['ID']>;
  updatedAt: Scalars['String'];
  user?: Maybe<Scalars['ID']>;
};

export type OneBankTransfer = {
  __typename?: 'OneBankTransfer';
  amount?: Maybe<Scalars['Float']>;
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  paymentMethodId?: Maybe<Scalars['String']>;
  reference?: Maybe<Scalars['String']>;
  remark?: Maybe<Scalars['String']>;
  store?: Maybe<Scalars['ID']>;
  type?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  user?: Maybe<Scalars['ID']>;
  verified?: Maybe<Scalars['Boolean']>;
  verifiedAt?: Maybe<Scalars['String']>;
  verifiedBy?: Maybe<Scalars['ID']>;
};

export type OneBanner = {
  __typename?: 'OneBanner';
  _id?: Maybe<Scalars['ID']>;
  active?: Maybe<Scalars['Boolean']>;
  createdAt: Scalars['String'];
  groupId?: Maybe<Scalars['String']>;
  groupTitle?: Maybe<Scalars['String']>;
  heading?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  img?: Maybe<Scalars['String']>;
  imgCdn?: Maybe<Scalars['String']>;
  isLinkExternal?: Maybe<Scalars['Boolean']>;
  isMobile?: Maybe<Scalars['Boolean']>;
  link?: Maybe<Scalars['String']>;
  pageId?: Maybe<Scalars['String']>;
  pageType?: Maybe<Scalars['String']>;
  sort?: Maybe<Scalars['Int']>;
  store?: Maybe<Scalars['ID']>;
  type?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
};

export type OneBlog = {
  __typename?: 'OneBlog';
  active?: Maybe<Scalars['Boolean']>;
  content?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  excerpt?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  img?: Maybe<Scalars['String']>;
  imgCdn?: Maybe<Scalars['String']>;
  published_at?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  store?: Maybe<Scalars['ID']>;
  tags?: Maybe<Array<Maybe<Scalars['String']>>>;
  title?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  user?: Maybe<Scalars['ID']>;
};

export type OneBrand = {
  __typename?: 'OneBrand';
  active?: Maybe<Scalars['Boolean']>;
  banner?: Maybe<Scalars['String']>;
  bannerCdn?: Maybe<Scalars['String']>;
  brandId?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  facebookUrl?: Maybe<Scalars['String']>;
  featured?: Maybe<Scalars['Boolean']>;
  googleUrl?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  img?: Maybe<Scalars['String']>;
  imgCdn?: Maybe<Scalars['String']>;
  info?: Maybe<Scalars['String']>;
  instaUrl?: Maybe<Scalars['String']>;
  linkedinUrl?: Maybe<Scalars['String']>;
  meta?: Maybe<Scalars['String']>;
  metaDescription?: Maybe<Scalars['String']>;
  metaKeywords?: Maybe<Scalars['String']>;
  metaTitle?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Scalars['ID']>;
  pinterestUrl?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Int']>;
  sizechart?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  store?: Maybe<Scalars['ID']>;
  twitterUrl?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  user?: Maybe<Scalars['ID']>;
  youtubeUrl?: Maybe<Scalars['String']>;
};

export type OneColor = {
  __typename?: 'OneColor';
  active?: Maybe<Scalars['Boolean']>;
  color_code?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  featured?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  info?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  store?: Maybe<Scalars['ID']>;
  updatedAt: Scalars['String'];
  val?: Maybe<Scalars['String']>;
};

export type OneCoupon = {
  __typename?: 'OneCoupon';
  active?: Maybe<Scalars['Boolean']>;
  code?: Maybe<Scalars['String']>;
  codes?: Maybe<Array<Maybe<UniqueCode>>>;
  color?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  discount?: Maybe<Discount1>;
  id: Scalars['ID'];
  info?: Maybe<Scalars['String']>;
  isMultiple?: Maybe<Scalars['Boolean']>;
  maxAmount?: Maybe<Scalars['Float']>;
  maxUselimit?: Maybe<Scalars['Int']>;
  msg?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  oneUsePerCustomer?: Maybe<Scalars['Boolean']>;
  oneUsePerUniqueCode?: Maybe<Scalars['Boolean']>;
  store?: Maybe<Scalars['ID']>;
  terms?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  used?: Maybe<Scalars['Int']>;
  validFrom?: Maybe<Scalars['String']>;
  validTo?: Maybe<Scalars['String']>;
};

export type OneCustomerMessage = {
  __typename?: 'OneCustomerMessage';
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  message?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  store?: Maybe<Scalars['ID']>;
};

export type OneFeature = {
  __typename?: 'OneFeature';
  active?: Maybe<Scalars['Boolean']>;
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  product?: Maybe<Scalars['ID']>;
  slug?: Maybe<Scalars['String']>;
  store?: Maybe<Scalars['ID']>;
  type?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type OneInventory = {
  __typename?: 'OneInventory';
  Vendor?: Maybe<Scalars['ID']>;
  action?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  left?: Maybe<Scalars['Int']>;
  notes?: Maybe<Scalars['String']>;
  product?: Maybe<Scalars['ID']>;
  quantity?: Maybe<Scalars['Int']>;
  reason?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  user?: Maybe<Scalars['ID']>;
};

export type OneLanguage = {
  __typename?: 'OneLanguage';
  active?: Maybe<Scalars['Boolean']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  nativeName?: Maybe<Scalars['String']>;
  phpLocaleCode?: Maybe<Scalars['String']>;
  rtl?: Maybe<Scalars['Boolean']>;
  sort?: Maybe<Scalars['Int']>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type OneOption = {
  __typename?: 'OneOption';
  createdAt: Scalars['String'];
  id?: Maybe<Scalars['ID']>;
  inputType?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Int']>;
  preselectDefault?: Maybe<Scalars['Boolean']>;
  product?: Maybe<Scalars['ID']>;
  required?: Maybe<Scalars['Boolean']>;
  updatedAt: Scalars['String'];
  user?: Maybe<Scalars['ID']>;
  values?: Maybe<Array<Maybe<Scalars['ID']>>>;
};

export type OneOptionValue = {
  __typename?: 'OneOptionValue';
  createdAt: Scalars['String'];
  default?: Maybe<Scalars['Boolean']>;
  direction?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isPercent?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  option?: Maybe<Scalars['ID']>;
  position?: Maybe<Scalars['Int']>;
  updatedAt: Scalars['String'];
  user?: Maybe<Scalars['ID']>;
  value?: Maybe<Scalars['Float']>;
};

export type OnePage = {
  __typename?: 'OnePage';
  active?: Maybe<Scalars['Boolean']>;
  content?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  keywords?: Maybe<Scalars['String']>;
  menuTitle?: Maybe<Scalars['String']>;
  metaDescription?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  store?: Maybe<Scalars['ID']>;
  title?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  user?: Maybe<Scalars['ID']>;
};

export type OnePayment = {
  __typename?: 'OnePayment';
  _id?: Maybe<Scalars['ID']>;
  amountDue?: Maybe<Scalars['Float']>;
  amountPaid?: Maybe<Scalars['Float']>;
  amountRefunded?: Maybe<Scalars['Float']>;
  approvalUrl?: Maybe<Scalars['String']>;
  captured?: Maybe<Scalars['Boolean']>;
  clientSecret?: Maybe<Scalars['String']>;
  contact?: Maybe<Scalars['String']>;
  currency?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  errorCode?: Maybe<Scalars['String']>;
  errorDescription?: Maybe<Scalars['String']>;
  fee?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['ID']>;
  invoiceId?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  orderId?: Maybe<Scalars['String']>;
  paid?: Maybe<Scalars['Boolean']>;
  paymentGateway?: Maybe<Scalars['String']>;
  paymentMode?: Maybe<Scalars['String']>;
  paymentOrderId?: Maybe<Scalars['String']>;
  receipt?: Maybe<Scalars['String']>;
  redirectUrl?: Maybe<Scalars['String']>;
  referenceId?: Maybe<Scalars['String']>;
  refundStatus?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  store?: Maybe<Scalars['ID']>;
  subscribe?: Maybe<Scalars['ID']>;
  tax?: Maybe<Scalars['Float']>;
  token?: Maybe<Scalars['String']>;
  txMsg?: Maybe<Scalars['String']>;
  txTime?: Maybe<Scalars['String']>;
};

export type OnePopularSearch = {
  __typename?: 'OnePopularSearch';
  id: Scalars['ID'];
  popularity?: Maybe<Scalars['String']>;
  store?: Maybe<Scalars['ID']>;
  text?: Maybe<Scalars['String']>;
};

export type OneProduct = {
  __typename?: 'OneProduct';
  _id?: Maybe<Scalars['ID']>;
  active?: Maybe<Scalars['Boolean']>;
  ageMax?: Maybe<Scalars['Int']>;
  ageMin?: Maybe<Scalars['Int']>;
  ageUnit?: Maybe<Scalars['String']>;
  approved?: Maybe<Scalars['Boolean']>;
  articleCode?: Maybe<Scalars['String']>;
  barcode?: Maybe<Scalars['String']>;
  batchNo?: Maybe<Scalars['String']>;
  brand?: Maybe<Scalars['ID']>;
  categories?: Maybe<Array<Scalars['ID']>>;
  category?: Maybe<Scalars['ID']>;
  categoryPool?: Maybe<Array<Scalars['ID']>>;
  cgst?: Maybe<Scalars['Float']>;
  channels?: Maybe<Array<Maybe<Scalars['ID']>>>;
  collections?: Maybe<Array<Maybe<Scalars['ID']>>>;
  color?: Maybe<Color>;
  colorGroup?: Maybe<Array<Maybe<Scalars['String']>>>;
  condition?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['ID']>;
  countryOfOrigin?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  currency?: Maybe<Scalars['String']>;
  daily?: Maybe<Scalars['Boolean']>;
  deliveryDetails?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  dimensionUnit?: Maybe<Scalars['String']>;
  discount?: Maybe<Scalars['Float']>;
  eanNo?: Maybe<Scalars['String']>;
  enableZips?: Maybe<Scalars['Boolean']>;
  expired?: Maybe<Scalars['Boolean']>;
  expiryDate?: Maybe<Scalars['String']>;
  featured?: Maybe<Scalars['Boolean']>;
  features?: Maybe<Array<Maybe<Scalars['ID']>>>;
  files?: Maybe<Array<Maybe<Scalars['String']>>>;
  foodType?: Maybe<Scalars['String']>;
  formattedMrp?: Maybe<Scalars['String']>;
  formattedPrice?: Maybe<Scalars['String']>;
  gender?: Maybe<Scalars['String']>;
  googleMerchantProductId?: Maybe<Scalars['String']>;
  group?: Maybe<Scalars['String']>;
  gtin?: Maybe<Scalars['String']>;
  hasStock?: Maybe<Scalars['Boolean']>;
  height?: Maybe<Scalars['Float']>;
  hot?: Maybe<Scalars['Boolean']>;
  hsn?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  igst?: Maybe<Scalars['Float']>;
  images?: Maybe<Array<Maybe<Scalars['String']>>>;
  imagesCdn?: Maybe<Array<Maybe<Scalars['String']>>>;
  img?: Maybe<Scalars['String']>;
  imgCdn?: Maybe<Scalars['String']>;
  info?: Maybe<Scalars['String']>;
  isCod?: Maybe<Scalars['Boolean']>;
  isSearchable?: Maybe<Scalars['Boolean']>;
  isUnlimited?: Maybe<Scalars['Boolean']>;
  itemId?: Maybe<Scalars['String']>;
  keyFeatures?: Maybe<Array<Maybe<Scalars['String']>>>;
  keywords?: Maybe<Scalars['String']>;
  keywordsA?: Maybe<Array<Maybe<Scalars['String']>>>;
  lat?: Maybe<Scalars['Float']>;
  length?: Maybe<Scalars['Float']>;
  link?: Maybe<Scalars['String']>;
  lng?: Maybe<Scalars['Float']>;
  manufacturer?: Maybe<Scalars['String']>;
  maxOrderQty?: Maybe<Scalars['Int']>;
  metaDescription?: Maybe<Scalars['String']>;
  metaTitle?: Maybe<Scalars['String']>;
  mfgDate?: Maybe<Scalars['String']>;
  minOrderQty?: Maybe<Scalars['Int']>;
  mrp?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
  new?: Maybe<Scalars['Boolean']>;
  options?: Maybe<Array<Maybe<Option>>>;
  parentBrand?: Maybe<Scalars['ID']>;
  parentCategory?: Maybe<Scalars['ID']>;
  popularity?: Maybe<Scalars['Float']>;
  position?: Maybe<Scalars['Float']>;
  preOrder?: Maybe<Scalars['Boolean']>;
  price?: Maybe<Scalars['Float']>;
  productDetails?: Maybe<Array<Maybe<Feature>>>;
  productMasterId?: Maybe<Scalars['String']>;
  ratings?: Maybe<Scalars['Float']>;
  recommended?: Maybe<Scalars['Boolean']>;
  relatedProducts?: Maybe<Array<Maybe<OneProduct>>>;
  replaceAllowed?: Maybe<Scalars['Boolean']>;
  replaceValidityInDays?: Maybe<Scalars['Int']>;
  returnAllowed?: Maybe<Scalars['Boolean']>;
  returnInfo?: Maybe<Scalars['String']>;
  returnValidityInDays?: Maybe<Scalars['Int']>;
  reviews?: Maybe<Scalars['Int']>;
  sale?: Maybe<Scalars['Boolean']>;
  sales?: Maybe<Scalars['Int']>;
  sgst?: Maybe<Scalars['Float']>;
  shippingCost?: Maybe<Scalars['Float']>;
  size?: Maybe<Scalars['ID']>;
  sizeGroup?: Maybe<Array<Maybe<Scalars['String']>>>;
  sizechart?: Maybe<Scalars['String']>;
  sku?: Maybe<Scalars['String']>;
  slots?: Maybe<Array<Maybe<Scalars['ID']>>>;
  slug?: Maybe<Scalars['String']>;
  sort?: Maybe<Scalars['Int']>;
  specifications?: Maybe<Array<Maybe<Feature>>>;
  status?: Maybe<Scalars['String']>;
  stock?: Maybe<Scalars['Int']>;
  store?: Maybe<Scalars['ID']>;
  styleCode?: Maybe<Scalars['String']>;
  styleId?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<Scalars['ID']>>>;
  tax?: Maybe<Scalars['Float']>;
  time?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  totalSold?: Maybe<Scalars['Int']>;
  trackInventory?: Maybe<Scalars['Boolean']>;
  trending?: Maybe<Scalars['Boolean']>;
  type?: Maybe<Scalars['String']>;
  unit?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  variants?: Maybe<Array<Maybe<Scalars['ID']>>>;
  vendor?: Maybe<Scalars['ID']>;
  warranty?: Maybe<Scalars['String']>;
  weight?: Maybe<Scalars['Float']>;
  width?: Maybe<Scalars['Float']>;
  zips?: Maybe<Array<Scalars['String']>>;
};

export type OnePromotion = {
  __typename?: 'OnePromotion';
  active?: Maybe<Scalars['Boolean']>;
  createdAt: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  discount?: Maybe<Discount1>;
  featured?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  img?: Maybe<Scalars['String']>;
  imgCdn?: Maybe<Scalars['String']>;
  maxAmount?: Maybe<Scalars['Float']>;
  maxUselimit?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  oneUsePerCustomer?: Maybe<Scalars['Boolean']>;
  platform?: Maybe<Scalars['String']>;
  priority?: Maybe<Scalars['Int']>;
  q?: Maybe<Scalars['String']>;
  store?: Maybe<Scalars['ID']>;
  updatedAt: Scalars['String'];
  used?: Maybe<Scalars['Int']>;
  user?: Maybe<Scalars['ID']>;
  validFrom?: Maybe<Scalars['String']>;
  validTo?: Maybe<Scalars['String']>;
};

export type OneReferral = {
  __typename?: 'OneReferral';
  commissionAmount?: Maybe<Scalars['Float']>;
  commissionSettled?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  referredFrom?: Maybe<Scalars['ID']>;
  referredTo?: Maybe<Scalars['ID']>;
  storeCreated?: Maybe<Scalars['Boolean']>;
  subscribe?: Maybe<Scalars['ID']>;
  subscribeAmount?: Maybe<Scalars['Float']>;
  subscriptionBought?: Maybe<Scalars['Boolean']>;
  walletTransaction?: Maybe<Scalars['ID']>;
};

export type OneReview = {
  __typename?: 'OneReview';
  active?: Maybe<Scalars['Boolean']>;
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  message?: Maybe<Scalars['String']>;
  pid?: Maybe<Scalars['ID']>;
  rating?: Maybe<Scalars['Float']>;
  store?: Maybe<Scalars['ID']>;
  updatedAt: Scalars['String'];
  user?: Maybe<Scalars['ID']>;
  variant?: Maybe<Scalars['ID']>;
  vendor?: Maybe<Scalars['ID']>;
  votes?: Maybe<Vote>;
};

export type OneSize = {
  __typename?: 'OneSize';
  active: Scalars['Boolean'];
  createdAt: Scalars['String'];
  featured?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  img?: Maybe<Scalars['String']>;
  imgCdn?: Maybe<Scalars['String']>;
  info?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  sort?: Maybe<Scalars['Float']>;
  store?: Maybe<Scalars['ID']>;
  updatedAt: Scalars['String'];
};

export type OneSlot = {
  __typename?: 'OneSlot';
  active?: Maybe<Scalars['Boolean']>;
  createdAt?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  info?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  store?: Maybe<Scalars['ID']>;
  updatedAt?: Maybe<Scalars['String']>;
  user?: Maybe<Scalars['ID']>;
  value?: Maybe<Scalars['String']>;
};

export type OneState = {
  __typename?: 'OneState';
  active?: Maybe<Scalars['Boolean']>;
  code?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['ID']>;
  createdAt: Scalars['String'];
  flag?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  img?: Maybe<Scalars['String']>;
  imgCdn?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  slug?: Maybe<Scalars['String']>;
  sort?: Maybe<Scalars['Int']>;
  states?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type OneStore = {
  __typename?: 'OneStore';
  active?: Maybe<Scalars['Boolean']>;
  address?: Maybe<Scalars['String']>;
  adminNotifications?: Maybe<AdminNotification>;
  alert?: Maybe<Scalars['String']>;
  analyticsTrackingId?: Maybe<Scalars['String']>;
  bankAccountHolderName?: Maybe<Scalars['String']>;
  bankAccountNo?: Maybe<Scalars['String']>;
  bankIfscCode?: Maybe<Scalars['String']>;
  bankSwiftCode?: Maybe<Scalars['String']>;
  banners?: Maybe<Array<Maybe<Scalars['String']>>>;
  city?: Maybe<Scalars['String']>;
  closed?: Maybe<Scalars['Boolean']>;
  closedMessage?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['ID']>;
  countryDetails?: Maybe<Country>;
  createdAt?: Maybe<Scalars['String']>;
  currency?: Maybe<Scalars['ID']>;
  currencyCode?: Maybe<Scalars['String']>;
  currencyDecimals?: Maybe<Scalars['Float']>;
  currencyDetails?: Maybe<Currency>;
  currencySuffix?: Maybe<Scalars['String']>;
  currencySymbol?: Maybe<Scalars['String']>;
  customerOrderNotifications?: Maybe<UserNotification>;
  description?: Maybe<Scalars['String']>;
  dimentionUnit?: Maybe<Scalars['String']>;
  domain?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  facebook?: Maybe<Scalars['String']>;
  facebookPixelId?: Maybe<Scalars['String']>;
  facebookUrl?: Maybe<Scalars['String']>;
  favicon?: Maybe<Scalars['String']>;
  faviconCdn?: Maybe<Scalars['String']>;
  featured?: Maybe<Scalars['Boolean']>;
  firstName?: Maybe<Scalars['String']>;
  freeShippingOn?: Maybe<Scalars['Float']>;
  gdpr?: Maybe<Scalars['Boolean']>;
  gdprCookieConsent?: Maybe<Scalars['String']>;
  google?: Maybe<Scalars['String']>;
  googleAdsTag?: Maybe<Scalars['String']>;
  hideDecimalInCurrency?: Maybe<Scalars['Boolean']>;
  homeMeta1?: Maybe<Scalars['String']>;
  homeMeta2?: Maybe<Scalars['String']>;
  homeMeta3?: Maybe<Scalars['String']>;
  homeMeta4?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  images?: Maybe<Array<Maybe<Scalars['String']>>>;
  imagesCdn?: Maybe<Array<Maybe<Scalars['String']>>>;
  img?: Maybe<Scalars['String']>;
  imgCdn?: Maybe<Scalars['String']>;
  instagram?: Maybe<Scalars['String']>;
  instagramUrl?: Maybe<Scalars['String']>;
  isCart?: Maybe<Scalars['Boolean']>;
  isFnb?: Maybe<Scalars['Boolean']>;
  isHideNilStock?: Maybe<Scalars['Boolean']>;
  isHyperlocal?: Maybe<Scalars['Boolean']>;
  isMegamenu?: Maybe<Scalars['Boolean']>;
  isOpen?: Maybe<Scalars['Boolean']>;
  isSearch?: Maybe<Scalars['Boolean']>;
  isWishlist?: Maybe<Scalars['Boolean']>;
  keywords?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  lat?: Maybe<Scalars['Float']>;
  legalName?: Maybe<Scalars['String']>;
  linkedin?: Maybe<Scalars['String']>;
  lng?: Maybe<Scalars['Float']>;
  locality?: Maybe<Scalars['String']>;
  logo?: Maybe<Scalars['String']>;
  logoCdn?: Maybe<Scalars['String']>;
  logoDark?: Maybe<Scalars['String']>;
  logoDarkCdn?: Maybe<Scalars['String']>;
  logoMobile?: Maybe<Scalars['String']>;
  logoMobileCdn?: Maybe<Scalars['String']>;
  logoMobileDark?: Maybe<Scalars['String']>;
  logoMobileDarkCdn?: Maybe<Scalars['String']>;
  metaDescription?: Maybe<Scalars['String']>;
  minOrderValue?: Maybe<Scalars['Float']>;
  minimumOrderValue?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
  openGraphImage?: Maybe<Scalars['String']>;
  openGraphImageCdn?: Maybe<Scalars['String']>;
  pageSize?: Maybe<Scalars['Int']>;
  phone?: Maybe<Scalars['String']>;
  pickrrAuthToken?: Maybe<Scalars['String']>;
  pinterestTag?: Maybe<Scalars['String']>;
  pinterestUrl?: Maybe<Scalars['String']>;
  priceDisplayFormat?: Maybe<Scalars['String']>;
  qrCode?: Maybe<Scalars['String']>;
  review?: Maybe<ReviewSetting>;
  searchbarText?: Maybe<Scalars['String']>;
  shipRocketChannelId?: Maybe<Scalars['String']>;
  shipRocketEmail?: Maybe<Scalars['String']>;
  shipRocketPassword?: Maybe<Scalars['String']>;
  shipping?: Maybe<Shipping>;
  shippingCharge?: Maybe<Scalars['Float']>;
  shippoToken?: Maybe<Scalars['String']>;
  shopAddress?: Maybe<Scalars['String']>;
  shopPhone?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  sms?: Maybe<Sms>;
  snapChatPixel?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  storeCountry?: Maybe<Scalars['ID']>;
  storeCurrency?: Maybe<Scalars['ID']>;
  storeId?: Maybe<Scalars['String']>;
  storeLanguage?: Maybe<Scalars['ID']>;
  storeTiming?: Maybe<Array<Maybe<StoreTiming>>>;
  timeDisplayFormat?: Maybe<Scalars['String']>;
  timeZone?: Maybe<Scalars['String']>;
  timing?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  twitter?: Maybe<Scalars['String']>;
  twitterUrl?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  user?: Maybe<Scalars['ID']>;
  vendorNotifications?: Maybe<VendorNotification>;
  webmail?: Maybe<Scalars['String']>;
  websiteEmail?: Maybe<Scalars['String']>;
  websiteLegalName?: Maybe<Scalars['String']>;
  websiteName?: Maybe<Scalars['String']>;
  weightUnit?: Maybe<Scalars['String']>;
  youtubeUrl?: Maybe<Scalars['String']>;
  zip?: Maybe<Scalars['String']>;
};

export type OneStoreCountry = {
  __typename?: 'OneStoreCountry';
  active?: Maybe<Scalars['Boolean']>;
  code?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['ID']>;
  createdAt?: Maybe<Scalars['String']>;
  default?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  store?: Maybe<Scalars['ID']>;
  updatedAt?: Maybe<Scalars['String']>;
  user?: Maybe<Scalars['ID']>;
};

export type OneStoreCurrency = {
  __typename?: 'OneStoreCurrency';
  active?: Maybe<Scalars['Boolean']>;
  conversionMode?: Maybe<Scalars['String']>;
  conversionRate?: Maybe<Scalars['Float']>;
  createdAt?: Maybe<Scalars['String']>;
  currency?: Maybe<Scalars['ID']>;
  decimalDigits?: Maybe<Scalars['Int']>;
  default?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['ID']>;
  isoCode?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  store?: Maybe<Scalars['ID']>;
  symbol?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  user?: Maybe<Scalars['ID']>;
};

export type OneStoreLanguage = {
  __typename?: 'OneStoreLanguage';
  active?: Maybe<Scalars['Boolean']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  default?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['ID']>;
  lang?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  store?: Maybe<Scalars['ID']>;
  updatedAt?: Maybe<Scalars['String']>;
  user?: Maybe<Scalars['ID']>;
};

export type OneSubscribe = {
  __typename?: 'OneSubscribe';
  EndTime?: Maybe<Scalars['String']>;
  EndTimeISO?: Maybe<Scalars['String']>;
  StartTime?: Maybe<Scalars['String']>;
  StartTimeISO?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['Float']>;
  amountDue?: Maybe<Scalars['Float']>;
  amountPaid?: Maybe<Scalars['Float']>;
  authLink?: Maybe<Scalars['String']>;
  clientSecret?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  daysLeft?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  img?: Maybe<Scalars['String']>;
  onGoing?: Maybe<Scalars['Boolean']>;
  paid?: Maybe<Scalars['Boolean']>;
  payment?: Maybe<Scalars['ID']>;
  paymentReferenceId?: Maybe<Scalars['String']>;
  subscription?: Maybe<Scalars['ID']>;
  updatedAt?: Maybe<Scalars['String']>;
  user?: Maybe<Scalars['ID']>;
};

export type OneSubscription = {
  __typename?: 'OneSubscription';
  abandonnedCartRecovery?: Maybe<Scalars['Boolean']>;
  active?: Maybe<Scalars['Boolean']>;
  annualPrice?: Maybe<Scalars['Float']>;
  appointments?: Maybe<Scalars['Boolean']>;
  callMeLimit?: Maybe<Scalars['Int']>;
  cashfreePlanId?: Maybe<Scalars['String']>;
  chatSupport?: Maybe<Scalars['Boolean']>;
  createdAt?: Maybe<Scalars['String']>;
  customDomain?: Maybe<Scalars['Boolean']>;
  delivery?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
  discountCoupons?: Maybe<Scalars['Boolean']>;
  emailSupport?: Maybe<Scalars['Boolean']>;
  expertConsultation?: Maybe<Scalars['String']>;
  features?: Maybe<Array<Maybe<Scalars['String']>>>;
  freeSSL?: Maybe<Scalars['Boolean']>;
  homepageAdvertise?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  maxAdminAllowed?: Maybe<Scalars['Int']>;
  misReports?: Maybe<Scalars['Boolean']>;
  monthlyPrice?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
  onlineStore?: Maybe<Scalars['Boolean']>;
  photosAllowed?: Maybe<Scalars['Int']>;
  pickup?: Maybe<Scalars['Boolean']>;
  premiumSupport?: Maybe<Scalars['Boolean']>;
  productImportExport?: Maybe<Scalars['Boolean']>;
  productsAllowed?: Maybe<Scalars['Int']>;
  removeMisikiLogo?: Maybe<Scalars['Boolean']>;
  salesChannels?: Maybe<Scalars['Boolean']>;
  seoOptions?: Maybe<Scalars['Boolean']>;
  stripePlanId?: Maybe<Scalars['String']>;
  tableBooking?: Maybe<Scalars['Boolean']>;
  title?: Maybe<Scalars['String']>;
  transactionFees?: Maybe<Scalars['Float']>;
  transactionFeesType?: Maybe<Scalars['String']>;
  unlimitedProducts?: Maybe<Scalars['Boolean']>;
  unlimitedValidity?: Maybe<Scalars['Boolean']>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type OneTag = {
  __typename?: 'OneTag';
  active?: Maybe<Scalars['Boolean']>;
  colorCode?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  store?: Maybe<Scalars['ID']>;
  updatedAt: Scalars['String'];
  user?: Maybe<Scalars['ID']>;
};

export type OneTemplate = {
  __typename?: 'OneTemplate';
  active?: Maybe<Scalars['Boolean']>;
  content?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  fileName?: Maybe<Scalars['String']>;
  folder?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  iconCdn?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  store?: Maybe<Scalars['ID']>;
  templateId?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  user?: Maybe<Scalars['ID']>;
  variables?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type OneUnit = {
  __typename?: 'OneUnit';
  active: Scalars['Boolean'];
  createdAt: Scalars['String'];
  featured?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  img?: Maybe<Scalars['String']>;
  info?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
};

export type OneVendor = {
  __typename?: 'OneVendor';
  about?: Maybe<Scalars['String']>;
  address?: Maybe<Scalars['ID']>;
  bankAccountHolderName?: Maybe<Scalars['String']>;
  bankAccountNo?: Maybe<Scalars['Float']>;
  bankIfsc?: Maybe<Scalars['String']>;
  bankName?: Maybe<Scalars['String']>;
  bankSwiftCode?: Maybe<Scalars['String']>;
  banner?: Maybe<Scalars['String']>;
  bannerCdn?: Maybe<Scalars['String']>;
  banners?: Maybe<Array<Maybe<Scalars['String']>>>;
  bannersCdn?: Maybe<Array<Maybe<Scalars['String']>>>;
  businessName?: Maybe<Scalars['String']>;
  categories?: Maybe<Array<Maybe<Scalars['ID']>>>;
  commissionType?: Maybe<Scalars['String']>;
  commissionValue?: Maybe<Scalars['Float']>;
  country?: Maybe<Scalars['ID']>;
  createdAt?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  facebookUrl?: Maybe<Scalars['String']>;
  freeShippingOn?: Maybe<Scalars['Float']>;
  githubUrl?: Maybe<Scalars['String']>;
  googleUrl?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  info?: Maybe<Info>;
  meta?: Maybe<Scalars['String']>;
  metaDescription?: Maybe<Scalars['String']>;
  metaKeywords?: Maybe<Scalars['String']>;
  metaTitle?: Maybe<Scalars['String']>;
  productSold?: Maybe<Scalars['Int']>;
  ratings?: Maybe<Scalars['Float']>;
  reviews?: Maybe<Scalars['Int']>;
  shippingCharges?: Maybe<Scalars['Float']>;
  slug?: Maybe<Scalars['String']>;
  store?: Maybe<Scalars['ID']>;
  storeName?: Maybe<Scalars['String']>;
  twitterUrl?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  user?: Maybe<Scalars['ID']>;
  verified?: Maybe<Scalars['Boolean']>;
  zips?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type OneWallet = {
  __typename?: 'OneWallet';
  balance?: Maybe<Scalars['Float']>;
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  updatedAt?: Maybe<Scalars['String']>;
  user?: Maybe<Scalars['ID']>;
};

export type OneWalletTransaction = {
  __typename?: 'OneWalletTransaction';
  amount?: Maybe<Scalars['Float']>;
  balanceAfter?: Maybe<Scalars['Float']>;
  balanceBefore?: Maybe<Scalars['Float']>;
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  purpose?: Maybe<Scalars['String']>;
  reference?: Maybe<Scalars['String']>;
  referenceId?: Maybe<Scalars['String']>;
  referenceTable?: Maybe<Scalars['String']>;
  summary?: Maybe<Scalars['String']>;
  trnxSummary?: Maybe<Scalars['String']>;
  trnxType?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  user?: Maybe<Scalars['ID']>;
  wallet?: Maybe<Scalars['ID']>;
};

export type OneWishlist = {
  __typename?: 'OneWishlist';
  active?: Maybe<Scalars['Boolean']>;
  createdAt?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  product?: Maybe<Product>;
  store?: Maybe<Scalars['ID']>;
  updatedAt?: Maybe<Scalars['String']>;
  user?: Maybe<Scalars['ID']>;
  variant?: Maybe<Product>;
};

export type OneWithdrawal = {
  __typename?: 'OneWithdrawal';
  amount?: Maybe<Scalars['Float']>;
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  remark?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  user?: Maybe<Scalars['ID']>;
  wallet?: Maybe<Scalars['ID']>;
};

export type Option = {
  __typename?: 'Option';
  createdAt: Scalars['String'];
  id?: Maybe<Scalars['ID']>;
  inputType?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Int']>;
  preselectDefault?: Maybe<Scalars['Boolean']>;
  product?: Maybe<Product>;
  required?: Maybe<Scalars['Boolean']>;
  updatedAt: Scalars['String'];
  user?: Maybe<User>;
  values?: Maybe<Array<Maybe<OptionValue>>>;
};

export type Option1 = {
  __typename?: 'Option1';
  option?: Maybe<Scalars['ID']>;
  values?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type OptionIp = {
  active?: InputMaybe<Scalars['Boolean']>;
  categories?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  id?: InputMaybe<Scalars['ID']>;
  info?: InputMaybe<Scalars['String']>;
  isFilter?: InputMaybe<Scalars['String']>;
  key?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  position?: InputMaybe<Scalars['Int']>;
  preselect?: InputMaybe<Scalars['Boolean']>;
  required?: InputMaybe<Scalars['Boolean']>;
  slug?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  val?: InputMaybe<Scalars['String']>;
  values?: InputMaybe<Array<InputMaybe<ValueIp>>>;
};

export type OptionIp1 = {
  option?: InputMaybe<Scalars['ID']>;
  values?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type OptionValue = {
  __typename?: 'OptionValue';
  createdAt: Scalars['String'];
  default?: Maybe<Scalars['Boolean']>;
  direction?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isPercent?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  option?: Maybe<Option>;
  position?: Maybe<Scalars['Int']>;
  updatedAt: Scalars['String'];
  user?: Maybe<User>;
  value?: Maybe<Scalars['Float']>;
};

export type Order = {
  __typename?: 'Order';
  address?: Maybe<Address>;
  addressId?: Maybe<Address>;
  amount?: Maybe<Amount>;
  amountDue?: Maybe<Scalars['Float']>;
  amountPaid?: Maybe<Scalars['Float']>;
  baseAmount?: Maybe<Amount>;
  baseCodPaid?: Maybe<Scalars['Float']>;
  baseTotalAmountRefunded?: Maybe<Scalars['Float']>;
  cancellationComment?: Maybe<Scalars['String']>;
  cancellationReason?: Maybe<Scalars['String']>;
  cartId: Cart;
  cfOrderId?: Maybe<Scalars['String']>;
  codPaid?: Maybe<Scalars['Float']>;
  comment?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  delivery?: Maybe<Delivery>;
  id?: Maybe<Scalars['ID']>;
  invoiceId?: Maybe<Scalars['String']>;
  items?: Maybe<Array<OrderItem>>;
  orderItems?: Maybe<Array<OrderItem>>;
  orderNo?: Maybe<Scalars['String']>;
  otp?: Maybe<Scalars['String']>;
  paid?: Maybe<Scalars['Boolean']>;
  paySuccess?: Maybe<Scalars['Int']>;
  payment?: Maybe<Payment>;
  paymentAmount?: Maybe<Scalars['Float']>;
  paymentCurrency?: Maybe<Scalars['String']>;
  paymentGateway?: Maybe<Scalars['String']>;
  paymentMode?: Maybe<Scalars['String']>;
  paymentMsg?: Maybe<Scalars['String']>;
  paymentOrderId?: Maybe<Scalars['String']>;
  paymentReceipt?: Maybe<Scalars['String']>;
  paymentReferenceId?: Maybe<Scalars['String']>;
  paymentStatus?: Maybe<Scalars['String']>;
  paymentTime?: Maybe<Scalars['String']>;
  returnComment?: Maybe<Scalars['String']>;
  reviewed?: Maybe<Scalars['Boolean']>;
  shippingOrderId?: Maybe<Scalars['String']>;
  store?: Maybe<Store>;
  totalAmountRefunded?: Maybe<Scalars['Float']>;
  updatedAt?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  userEmail?: Maybe<Scalars['String']>;
  userFirstName?: Maybe<Scalars['String']>;
  userLastName?: Maybe<Scalars['String']>;
  userPhone?: Maybe<Scalars['String']>;
};

export type OrderHistory = {
  __typename?: 'OrderHistory';
  body?: Maybe<Scalars['String']>;
  courierName?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  index?: Maybe<Scalars['Int']>;
  public?: Maybe<Scalars['Boolean']>;
  status?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  trackingId?: Maybe<Scalars['String']>;
};

export type OrderItem = {
  __typename?: 'OrderItem';
  active?: Maybe<Scalars['Boolean']>;
  address?: Maybe<Address>;
  addressId?: Maybe<Address>;
  ageMax?: Maybe<Scalars['Int']>;
  ageMin?: Maybe<Scalars['Int']>;
  ageUnit?: Maybe<Scalars['String']>;
  amount?: Maybe<Amount>;
  amountDue?: Maybe<Scalars['Float']>;
  amountPaid?: Maybe<Scalars['Float']>;
  amountRefunded?: Maybe<Scalars['Float']>;
  barcode?: Maybe<Scalars['String']>;
  baseAmount?: Maybe<Amount>;
  baseAmountRefunded?: Maybe<Scalars['Float']>;
  baseCodPaid?: Maybe<Scalars['Float']>;
  baseDiscount?: Maybe<Scalars['Float']>;
  baseMrp?: Maybe<Scalars['Float']>;
  basePaymentAmount?: Maybe<Scalars['Float']>;
  basePrice?: Maybe<Scalars['Float']>;
  baseShippingCharge?: Maybe<Scalars['Float']>;
  baseSubtotal?: Maybe<Scalars['Float']>;
  baseTax?: Maybe<Scalars['Float']>;
  baseTotal?: Maybe<Scalars['Float']>;
  baseTotalAmountRefunded?: Maybe<Scalars['Float']>;
  baseTotalDiscount?: Maybe<Scalars['Float']>;
  billingAddress?: Maybe<Address>;
  brand?: Maybe<Brand>;
  brandImg?: Maybe<Scalars['String']>;
  brandImgCdn?: Maybe<Scalars['String']>;
  brandName?: Maybe<Scalars['String']>;
  cancellationComment?: Maybe<Scalars['String']>;
  cancellationReason?: Maybe<Scalars['String']>;
  cartId: Cart;
  cfOrderId?: Maybe<Scalars['String']>;
  codPaid?: Maybe<Scalars['Float']>;
  color?: Maybe<Scalars['String']>;
  comment?: Maybe<Scalars['String']>;
  coupon?: Maybe<Coupon>;
  courierName?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  currency?: Maybe<Scalars['String']>;
  days?: Maybe<Scalars['Int']>;
  delivery?: Maybe<Delivery>;
  deliveryDetails?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  dimensionUnit?: Maybe<Scalars['String']>;
  discount?: Maybe<Scalars['Float']>;
  estimatedDeliveryDate?: Maybe<Scalars['String']>;
  expectedDeliveryDate?: Maybe<Scalars['String']>;
  foodType?: Maybe<Scalars['String']>;
  formattedAmount?: Maybe<OrderItemAmount>;
  formattedAmountDue?: Maybe<Scalars['String']>;
  formattedAmountPaid?: Maybe<Scalars['String']>;
  formattedAmountRefunded?: Maybe<Scalars['String']>;
  formattedCodPaid?: Maybe<Scalars['String']>;
  formattedDiscount?: Maybe<Scalars['String']>;
  formattedMrp?: Maybe<Scalars['String']>;
  formattedPaymentAmount?: Maybe<Scalars['String']>;
  formattedPrice?: Maybe<Scalars['String']>;
  formattedShippingCharge?: Maybe<Scalars['String']>;
  formattedSubtotal?: Maybe<Scalars['String']>;
  formattedTax?: Maybe<Scalars['String']>;
  formattedTotal?: Maybe<Scalars['String']>;
  formattedTotalAmountRefunded?: Maybe<Scalars['String']>;
  formattedTotalDiscount?: Maybe<Scalars['String']>;
  formattedVendorCommission?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  img?: Maybe<Scalars['String']>;
  imgCdn?: Maybe<Scalars['String']>;
  invoiceId?: Maybe<Scalars['String']>;
  invoiceLink?: Maybe<Scalars['String']>;
  isReplacement?: Maybe<Scalars['Boolean']>;
  itemOrderNo?: Maybe<Scalars['String']>;
  mrp?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
  options?: Maybe<Option1>;
  orderHistory?: Maybe<Array<Maybe<OrderHistory>>>;
  orderId?: Maybe<Scalars['ID']>;
  orderItemId?: Maybe<Scalars['ID']>;
  orderNo?: Maybe<Scalars['String']>;
  orderStatus?: Maybe<Array<Maybe<OrderStatusRes>>>;
  otp?: Maybe<Scalars['String']>;
  paid?: Maybe<Scalars['Boolean']>;
  parentBrand?: Maybe<Brand>;
  parentBrandImg?: Maybe<Scalars['String']>;
  parentBrandImgCdn?: Maybe<Scalars['String']>;
  parentBrandName?: Maybe<Scalars['String']>;
  paySuccess?: Maybe<Scalars['Int']>;
  payment?: Maybe<Payment>;
  paymentAmount?: Maybe<Scalars['Float']>;
  paymentCurrency?: Maybe<Scalars['String']>;
  paymentGateway?: Maybe<Scalars['String']>;
  paymentMode?: Maybe<Scalars['String']>;
  paymentMsg?: Maybe<Scalars['String']>;
  paymentNotes?: Maybe<Scalars['String']>;
  paymentOrderId?: Maybe<Scalars['String']>;
  paymentReceipt?: Maybe<Scalars['String']>;
  paymentReferenceId?: Maybe<Scalars['String']>;
  paymentStatus?: Maybe<Scalars['String']>;
  paymentTime?: Maybe<Scalars['String']>;
  pid?: Maybe<Scalars['ID']>;
  posInvoiceNo?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Float']>;
  qty?: Maybe<Scalars['Int']>;
  refunds?: Maybe<Array<Maybe<Refund>>>;
  replaceValidTill?: Maybe<Scalars['String']>;
  returnComment?: Maybe<Scalars['String']>;
  returnCourierName?: Maybe<Scalars['String']>;
  returnPolicyExpired?: Maybe<Scalars['Boolean']>;
  returnReason?: Maybe<Scalars['String']>;
  returnTrackingId?: Maybe<Scalars['String']>;
  returnValidTill?: Maybe<Scalars['String']>;
  reviewed?: Maybe<Scalars['Boolean']>;
  shippingCarrier?: Maybe<Scalars['String']>;
  shippingCharge?: Maybe<Scalars['Float']>;
  shippingCommercialInvoiceUrl?: Maybe<Scalars['String']>;
  shippingLabelId?: Maybe<Scalars['String']>;
  shippingLabelUrl?: Maybe<Scalars['String']>;
  shippingOrderId?: Maybe<Scalars['String']>;
  shippingProvider?: Maybe<Scalars['String']>;
  shippingRateId?: Maybe<Scalars['String']>;
  shippingTrackingNumber?: Maybe<Scalars['String']>;
  shippingTrackingStatus?: Maybe<Scalars['String']>;
  shippingTrackingUrlProvider?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['String']>;
  sku?: Maybe<Scalars['String']>;
  slot?: Maybe<Slot>;
  slotId?: Maybe<Slot>;
  slug?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  store?: Maybe<Store>;
  subtotal?: Maybe<Scalars['Float']>;
  tax?: Maybe<Scalars['Float']>;
  time?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Float']>;
  totalAmountRefunded?: Maybe<Scalars['Float']>;
  totalDiscount?: Maybe<Scalars['Float']>;
  tracking?: Maybe<Scalars['String']>;
  trackingId?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  unit?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  usedOptions?: Maybe<Array<Maybe<UsedOption>>>;
  user?: Maybe<User>;
  userEmail?: Maybe<Scalars['String']>;
  userFirstName?: Maybe<Scalars['String']>;
  userLastName?: Maybe<Scalars['String']>;
  userPhone?: Maybe<Scalars['String']>;
  vendor?: Maybe<Vendor>;
  vendorAddress?: Maybe<Address>;
  vendorAddressId?: Maybe<Address>;
  vendorBusinessName?: Maybe<Scalars['String']>;
  vendorCommissionType?: Maybe<Scalars['String']>;
  vendorCommissionValue?: Maybe<Scalars['Float']>;
  vendorEmail?: Maybe<Scalars['String']>;
  vendorInfo?: Maybe<Vendor>;
  vendorPhone?: Maybe<Scalars['String']>;
  weight?: Maybe<Scalars['Float']>;
};

export type OrderItemAmount = {
  __typename?: 'OrderItemAmount';
  discount?: Maybe<Scalars['String']>;
  exchangeRate?: Maybe<Scalars['String']>;
  shipping?: Maybe<Scalars['String']>;
  subtotal?: Maybe<Scalars['String']>;
  tax?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['String']>;
  totalDiscount?: Maybe<Scalars['String']>;
};

export type OrderStatus = {
  __typename?: 'OrderStatus';
  body?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  index?: Maybe<Scalars['Int']>;
  public?: Maybe<Scalars['Boolean']>;
  status?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type OrderStatusRes = {
  __typename?: 'OrderStatusRes';
  active: Scalars['Boolean'];
  courier_name?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  event?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  item?: Maybe<Scalars['ID']>;
  order?: Maybe<Scalars['ID']>;
  tracking_id?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  user?: Maybe<Scalars['ID']>;
};

export type Otp = {
  __typename?: 'Otp';
  otp?: Maybe<Scalars['String']>;
  timer?: Maybe<Scalars['Int']>;
};

export type Page = {
  __typename?: 'Page';
  active?: Maybe<Scalars['Boolean']>;
  content?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  keywords?: Maybe<Scalars['String']>;
  menuTitle?: Maybe<Scalars['String']>;
  metaDescription?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  store?: Maybe<Store>;
  title?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  user?: Maybe<User>;
};

export type PayMethodRes = {
  __typename?: 'PayMethodRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<PaymentMethod>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type PayPalAmount = {
  __typename?: 'PayPalAmount';
  currency?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Float']>;
};

export type PayPalLink = {
  __typename?: 'PayPalLink';
  href?: Maybe<Scalars['String']>;
  method?: Maybe<Scalars['String']>;
  rel?: Maybe<Scalars['String']>;
};

export type PayPalRes = {
  __typename?: 'PayPalRes';
  create_time?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  intent?: Maybe<Scalars['String']>;
  links?: Maybe<Array<Maybe<PayPalLink>>>;
  orderId?: Maybe<Scalars['String']>;
  redirect_url?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  transactions?: Maybe<Array<Maybe<PayPalTransaction>>>;
};

export type PayPalTransaction = {
  __typename?: 'PayPalTransaction';
  amount?: Maybe<PayPalAmount>;
  description?: Maybe<Scalars['String']>;
};

export type PayRes = {
  __typename?: 'PayRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Payment>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type Payment = {
  __typename?: 'Payment';
  _id?: Maybe<Scalars['ID']>;
  amountDue?: Maybe<Scalars['Float']>;
  amountPaid?: Maybe<Scalars['Float']>;
  amountRefunded?: Maybe<Scalars['Float']>;
  captured?: Maybe<Scalars['Boolean']>;
  contact?: Maybe<Scalars['String']>;
  currency?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  errorCode?: Maybe<Scalars['String']>;
  errorDescription?: Maybe<Scalars['String']>;
  fee?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['ID']>;
  invoiceId?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  orderId?: Maybe<Scalars['String']>;
  paid?: Maybe<Scalars['Boolean']>;
  paymentGateway?: Maybe<Scalars['String']>;
  paymentMode?: Maybe<Scalars['String']>;
  paymentOrderId?: Maybe<Scalars['String']>;
  receipt?: Maybe<Scalars['String']>;
  redirectUrl?: Maybe<Scalars['String']>;
  referenceId?: Maybe<Scalars['String']>;
  refundStatus?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  store?: Maybe<Store>;
  subscribe?: Maybe<Scalars['ID']>;
  tax?: Maybe<Scalars['Float']>;
  token?: Maybe<Scalars['String']>;
  txMsg?: Maybe<Scalars['String']>;
  txTime?: Maybe<Scalars['String']>;
};

export type PaymentMethod = {
  __typename?: 'PaymentMethod';
  active?: Maybe<Scalars['Boolean']>;
  color?: Maybe<Scalars['String']>;
  featured?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  img?: Maybe<Scalars['String']>;
  imgCdn?: Maybe<Scalars['String']>;
  instructions?: Maybe<Scalars['String']>;
  isError?: Maybe<Scalars['Boolean']>;
  key?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  position?: Maybe<Scalars['Int']>;
  qrcode?: Maybe<Scalars['String']>;
  store?: Maybe<Store>;
  text?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type PopularSearch = {
  __typename?: 'PopularSearch';
  id: Scalars['ID'];
  popularity?: Maybe<Scalars['String']>;
  store?: Maybe<Store>;
  text?: Maybe<Scalars['String']>;
};

export type PopularSearchRes = {
  __typename?: 'PopularSearchRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<PopularSearch>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type Product = {
  __typename?: 'Product';
  _id?: Maybe<Scalars['ID']>;
  active?: Maybe<Scalars['Boolean']>;
  ageMax?: Maybe<Scalars['Int']>;
  ageMin?: Maybe<Scalars['Int']>;
  ageUnit?: Maybe<Scalars['String']>;
  approved?: Maybe<Scalars['Boolean']>;
  articleCode?: Maybe<Scalars['String']>;
  barcode?: Maybe<Scalars['String']>;
  batchNo?: Maybe<Scalars['String']>;
  brand?: Maybe<Brand>;
  categories?: Maybe<Array<Category>>;
  category?: Maybe<Category>;
  categoryPool?: Maybe<Array<Category>>;
  cgst?: Maybe<Scalars['Float']>;
  channels?: Maybe<Array<Maybe<Channel>>>;
  collections?: Maybe<Array<Maybe<Collection>>>;
  color?: Maybe<Color>;
  colorGroup?: Maybe<Array<Maybe<Product>>>;
  condition?: Maybe<Scalars['String']>;
  country?: Maybe<Country>;
  countryOfOrigin?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  currency?: Maybe<Scalars['String']>;
  daily?: Maybe<Scalars['Boolean']>;
  deliveryDetails?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  dimensionUnit?: Maybe<Scalars['String']>;
  discount?: Maybe<Scalars['Float']>;
  eanNo?: Maybe<Scalars['String']>;
  enableZips?: Maybe<Scalars['Boolean']>;
  expired?: Maybe<Scalars['Boolean']>;
  expiryDate?: Maybe<Scalars['String']>;
  featured?: Maybe<Scalars['Boolean']>;
  features?: Maybe<Array<Maybe<Feature>>>;
  files?: Maybe<Array<Maybe<Scalars['String']>>>;
  foodType?: Maybe<Scalars['String']>;
  formattedMrp?: Maybe<Scalars['String']>;
  formattedPrice?: Maybe<Scalars['String']>;
  gender?: Maybe<Scalars['String']>;
  googleMerchantProductId?: Maybe<Scalars['String']>;
  group?: Maybe<Scalars['String']>;
  gtin?: Maybe<Scalars['String']>;
  hasStock?: Maybe<Scalars['Boolean']>;
  height?: Maybe<Scalars['Float']>;
  hot?: Maybe<Scalars['Boolean']>;
  hsn?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  igst?: Maybe<Scalars['Float']>;
  images?: Maybe<Array<Maybe<Scalars['String']>>>;
  imagesCdn?: Maybe<Array<Maybe<Scalars['String']>>>;
  img?: Maybe<Scalars['String']>;
  imgCdn?: Maybe<Scalars['String']>;
  info?: Maybe<Scalars['String']>;
  isCod?: Maybe<Scalars['Boolean']>;
  isSearchable?: Maybe<Scalars['Boolean']>;
  isUnlimited?: Maybe<Scalars['Boolean']>;
  itemId?: Maybe<Scalars['String']>;
  keyFeatures?: Maybe<Array<Maybe<Scalars['String']>>>;
  keywords?: Maybe<Scalars['String']>;
  keywordsA?: Maybe<Array<Maybe<Scalars['String']>>>;
  lat?: Maybe<Scalars['Float']>;
  length?: Maybe<Scalars['Float']>;
  link?: Maybe<Scalars['String']>;
  lng?: Maybe<Scalars['Float']>;
  manufacturer?: Maybe<Scalars['String']>;
  maxOrderQty?: Maybe<Scalars['Int']>;
  metaDescription?: Maybe<Scalars['String']>;
  metaTitle?: Maybe<Scalars['String']>;
  mfgDate?: Maybe<Scalars['String']>;
  minOrderQty?: Maybe<Scalars['Int']>;
  mrp?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
  new?: Maybe<Scalars['Boolean']>;
  options?: Maybe<Array<Maybe<Option>>>;
  parentBrand?: Maybe<Brand>;
  parentCategory?: Maybe<Category>;
  popularity?: Maybe<Scalars['Float']>;
  position?: Maybe<Scalars['Float']>;
  preOrder?: Maybe<Scalars['Boolean']>;
  price?: Maybe<Scalars['Float']>;
  productDetails?: Maybe<Array<Maybe<Feature>>>;
  productMasterId?: Maybe<Scalars['String']>;
  ratings?: Maybe<Scalars['Float']>;
  recommended?: Maybe<Scalars['Boolean']>;
  relatedProducts?: Maybe<Array<Maybe<Product>>>;
  replaceAllowed?: Maybe<Scalars['Boolean']>;
  replaceValidityInDays?: Maybe<Scalars['Int']>;
  returnAllowed?: Maybe<Scalars['Boolean']>;
  returnInfo?: Maybe<Scalars['String']>;
  returnValidityInDays?: Maybe<Scalars['Int']>;
  reviews?: Maybe<Scalars['Int']>;
  sale?: Maybe<Scalars['Boolean']>;
  sales?: Maybe<Scalars['Int']>;
  sgst?: Maybe<Scalars['Float']>;
  shippingCost?: Maybe<Scalars['Float']>;
  size?: Maybe<Size>;
  sizeGroup?: Maybe<Array<Maybe<Product>>>;
  sizechart?: Maybe<Scalars['String']>;
  sku?: Maybe<Scalars['String']>;
  slots?: Maybe<Array<Maybe<Slot>>>;
  slug?: Maybe<Scalars['String']>;
  sort?: Maybe<Scalars['Int']>;
  specifications?: Maybe<Array<Maybe<Feature>>>;
  status?: Maybe<Scalars['String']>;
  stock?: Maybe<Scalars['Int']>;
  store?: Maybe<Store>;
  styleCode?: Maybe<Scalars['String']>;
  styleId?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  tax?: Maybe<Scalars['Float']>;
  time?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  totalSold?: Maybe<Scalars['Int']>;
  trackInventory?: Maybe<Scalars['Boolean']>;
  trending?: Maybe<Scalars['Boolean']>;
  type?: Maybe<Scalars['String']>;
  unit?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  variants?: Maybe<Array<Maybe<Variant>>>;
  vendor?: Maybe<Vendor>;
  warranty?: Maybe<Scalars['String']>;
  weight?: Maybe<Scalars['Float']>;
  width?: Maybe<Scalars['Float']>;
  zips?: Maybe<Array<Scalars['String']>>;
};

export type ProductSetting = {
  __typename?: 'ProductSetting';
  moderate?: Maybe<Scalars['Boolean']>;
};

export type ProductSettingIp = {
  moderate?: InputMaybe<Scalars['Boolean']>;
};

export type Promotion = {
  __typename?: 'Promotion';
  active?: Maybe<Scalars['Boolean']>;
  createdAt: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  discount?: Maybe<Discount1>;
  featured?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  img?: Maybe<Scalars['String']>;
  imgCdn?: Maybe<Scalars['String']>;
  maxAmount?: Maybe<Scalars['Float']>;
  maxUselimit?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  oneUsePerCustomer?: Maybe<Scalars['Boolean']>;
  platform?: Maybe<Scalars['String']>;
  priority?: Maybe<Scalars['Int']>;
  q?: Maybe<Scalars['String']>;
  store?: Maybe<Store>;
  updatedAt: Scalars['String'];
  used?: Maybe<Scalars['Int']>;
  user?: Maybe<User>;
  validFrom?: Maybe<Scalars['String']>;
  validTo?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  _?: Maybe<Scalars['String']>;
  abandoned?: Maybe<CartRes>;
  address?: Maybe<Address>;
  addresses?: Maybe<AddressRes>;
  allBanners?: Maybe<BannerRes>;
  allCategories?: Maybe<CategoryRes>;
  allOrders?: Maybe<OrderRes>;
  allScheduleDemos?: Maybe<ScheduleDemoRes>;
  allUsers?: Maybe<UserRes>;
  appointment?: Maybe<Appointment>;
  appointments?: Maybe<AppointmentRes>;
  attribute?: Maybe<Attribute>;
  attributeCategories?: Maybe<Array<Maybe<Category>>>;
  attributes?: Maybe<AttributeRes>;
  autocompleteEsSync?: Maybe<Scalars['Boolean']>;
  bankTransfer?: Maybe<BankTransfer>;
  bankTransfers?: Maybe<BankTransferRes>;
  banner?: Maybe<OneBanner>;
  bannerGroup?: Maybe<BannerRes>;
  banners?: Maybe<BannerRes>;
  bestSellers?: Maybe<BestSellers>;
  blog?: Maybe<Blog>;
  blogs?: Maybe<BlogRes>;
  brand?: Maybe<Brand>;
  brand1?: Maybe<OneBrand>;
  brands?: Maybe<BrandRes>;
  byVendor?: Maybe<DeliveryByVendor>;
  cart?: Maybe<Cart>;
  cart1?: Maybe<Cart>;
  carts?: Maybe<CartRes>;
  categories?: Maybe<CategoryResSimple>;
  category?: Maybe<Category>;
  categoryAttributes?: Maybe<AttributeRes>;
  categorySimple?: Maybe<CategorySimple>;
  categorySummary?: Maybe<TodaysSummary>;
  channel?: Maybe<Channel>;
  channel1?: Maybe<ChannelOne>;
  channelList?: Maybe<Array<Maybe<ChannelList>>>;
  channelMessages?: Maybe<InstantMessageRes>;
  channels?: Maybe<ChannelRes>;
  checkWishlist?: Maybe<Scalars['Boolean']>;
  collection?: Maybe<CollectionOne>;
  collections?: Maybe<CollectionRes>;
  collectionsProducts?: Maybe<SearchRes>;
  color?: Maybe<Color>;
  colors?: Maybe<ColorRes>;
  countries?: Maybe<CountryRes>;
  country?: Maybe<Country>;
  coupon?: Maybe<Coupon>;
  coupons?: Maybe<CouponRes>;
  couponsAdmin?: Maybe<CouponRes>;
  currencies?: Maybe<CurrencyRes>;
  currency?: Maybe<Currency>;
  customerMessage?: Maybe<CustomerMessage>;
  customerMessages?: Maybe<CustomerMessageRes>;
  customers?: Maybe<OrderItemRes>;
  dailySales?: Maybe<Array<Maybe<SalesData>>>;
  deal?: Maybe<Deal>;
  dealOne?: Maybe<DealOne>;
  deals?: Maybe<DealRes>;
  delivery?: Maybe<Delivery>;
  discount?: Maybe<Discount>;
  discounts?: Maybe<DiscountRes>;
  endDeal?: Maybe<Scalars['Boolean']>;
  event?: Maybe<Event>;
  eventOnDate?: Maybe<Event>;
  events?: Maybe<EventRes>;
  faq?: Maybe<Faq>;
  faq1?: Maybe<FaqOne>;
  faqTopic?: Maybe<FaqTopic>;
  faqTopics?: Maybe<FaqTopicRes>;
  faqs?: Maybe<FaqRes>;
  fbListProduct?: Maybe<Array<Maybe<FbProduct>>>;
  fbProduct?: Maybe<FbProduct>;
  fcmToken?: Maybe<Scalars['Boolean']>;
  feature?: Maybe<Feature>;
  features?: Maybe<FeatureRes>;
  fetchVimeo?: Maybe<Scalars['String']>;
  gGetProduct?: Maybe<Product>;
  gListProduct?: Maybe<Array<Maybe<Product>>>;
  gdprDataDeleteRequests?: Maybe<GdprDataDeleteRequestRes>;
  getAllStoredVideos?: Maybe<NeteaseVideoRes>;
  getCartQty: Scalars['Int'];
  getCoordinatesFromZip?: Maybe<Coords>;
  getGdprDataDeleteRequest?: Maybe<GdprDataDeleteRequest>;
  getLocation?: Maybe<Address>;
  getLocationFromZip?: Maybe<Address>;
  getLocationFromZipIndia?: Maybe<Address>;
  getNearbyVendors?: Maybe<Array<Maybe<Address>>>;
  getNeteaseChannel?: Maybe<Channel>;
  getVariant?: Maybe<Variant>;
  getVideoLink?: Maybe<Scalars['String']>;
  globalOption?: Maybe<GlobalOption>;
  globalOptionValue?: Maybe<GlobalOptionValue>;
  globalOptionValues?: Maybe<GlobalOptionValueRes>;
  globalOptions?: Maybe<GlobalOptionRes>;
  groupByBanner?: Maybe<Array<Maybe<BannerGroup>>>;
  groupByBanner1?: Maybe<Array<Maybe<BannerGroup1>>>;
  hasOrder?: Maybe<Scalars['Boolean']>;
  importDetails?: Maybe<ImportDetailRes>;
  inactiveProducts?: Maybe<Scalars['Int']>;
  influencer?: Maybe<Influencer>;
  influencers?: Maybe<InfluencerRes>;
  invalidPrice?: Maybe<SearchRes>;
  invalidVendor?: Maybe<SearchRes>;
  inventories?: Maybe<InventoryRes>;
  inventory?: Maybe<Inventory>;
  isSubscribed?: Maybe<Scalars['Boolean']>;
  language?: Maybe<Language>;
  languages?: Maybe<LanguageRes>;
  listDeals?: Maybe<DealRes>;
  location?: Maybe<Location>;
  locations?: Maybe<LocationRes>;
  master_id_product?: Maybe<SearchRes>;
  me?: Maybe<UserOne>;
  media?: Maybe<Media>;
  medias?: Maybe<Array<Media>>;
  megamenu?: Maybe<Array<Maybe<Category>>>;
  megamenuAll?: Maybe<Array<Maybe<CategorySimple>>>;
  myAddresses?: Maybe<AddressRes>;
  myAppointments?: Maybe<AppointmentRes>;
  myChannels?: Maybe<ChannelRes>;
  myCurrentSubscriptionDetail?: Maybe<Subscribe>;
  myCustomers?: Maybe<UserRes>;
  myDeals?: Maybe<DealRes>;
  myOrderItems?: Maybe<OrderItemRes>;
  myOrders?: Maybe<OrderRes>;
  myProducts?: Maybe<SearchRes>;
  myReferrals?: Maybe<ReferralRes>;
  myScheduleDemos?: Maybe<ScheduleDemoRes>;
  mySubscribes?: Maybe<SubscribeRes>;
  myTags?: Maybe<TagRes>;
  myTokens?: Maybe<FcmTokenRes>;
  myVideos?: Maybe<VideoRes>;
  myWallet?: Maybe<OneWallet>;
  myWalletTransactions?: Maybe<WalletTransactionRes>;
  myWishlist?: Maybe<WishlistRes>;
  neteaseToken?: Maybe<AppKeyAndToken>;
  nextProduct?: Maybe<OneProduct>;
  noDescription?: Maybe<SearchRes>;
  noImage?: Maybe<SearchRes>;
  noPrice?: Maybe<SearchRes>;
  noStock?: Maybe<SearchRes>;
  option?: Maybe<Option>;
  optionValue?: Maybe<OptionValue>;
  optionValues?: Maybe<OptionValueRes>;
  options?: Maybe<OptionRes>;
  order?: Maybe<Order>;
  orderItem?: Maybe<OrderItem>;
  orderItems?: Maybe<OrderItemRes>;
  orderStatus?: Maybe<OrderStatusRes>;
  orderStatusOfOrder?: Maybe<Array<Maybe<OrderStatusRes>>>;
  orderStatuses?: Maybe<Array<OrderStatus>>;
  orderSummary?: Maybe<TodaysSummary>;
  orders?: Maybe<OrderItemRes>;
  ordersByStatus?: Maybe<MyCustomerRes>;
  ordersForPickup?: Maybe<MyCustomerRes>;
  page?: Maybe<Page>;
  pageSlug?: Maybe<Page>;
  pages?: Maybe<PageRes>;
  parentBrands?: Maybe<BrandRes>;
  payment?: Maybe<Payment>;
  paymentMethod?: Maybe<PaymentMethod>;
  paymentMethodSummary?: Maybe<Array<Maybe<MethodsSummary>>>;
  paymentMethods?: Maybe<PayMethodRes>;
  paymentMethodsAdmin?: Maybe<PayMethodRes>;
  paymentStatuses?: Maybe<Array<Scalars['String']>>;
  payments?: Maybe<PayRes>;
  paymentsByType?: Maybe<Array<Maybe<PaymentTypeData>>>;
  paymentsSummary?: Maybe<TodaysSummary>;
  pickrrServiceability?: Maybe<Scalars['Boolean']>;
  popular?: Maybe<SearchRes>;
  popularSearch?: Maybe<PopularSearch>;
  popularSearches?: Maybe<PopularSearchRes>;
  prevProduct?: Maybe<OneProduct>;
  product?: Maybe<Product>;
  product1?: Maybe<OneProduct>;
  productEs?: Maybe<ProdEs>;
  productFeatures?: Maybe<FeatureRes>;
  productReviews?: Maybe<ReviewRes>;
  productSlug?: Maybe<Product>;
  productSummary?: Maybe<TodaysSummary>;
  product_group?: Maybe<GroupRes>;
  products?: Maybe<SearchRes>;
  productsByIds?: Maybe<Array<Maybe<Product>>>;
  productsEsTruncate?: Maybe<Scalars['Boolean']>;
  productsSync?: Maybe<Scalars['Boolean']>;
  promotion?: Maybe<Promotion>;
  promotions?: Maybe<PromotionRes>;
  promotionsAdmin?: Maybe<PromotionRes>;
  randomVendors?: Maybe<Array<Maybe<Vendor>>>;
  razorpays?: Maybe<Payment>;
  recommended?: Maybe<Array<Maybe<Product>>>;
  referral?: Maybe<Referral>;
  referrals?: Maybe<ReferralRes>;
  returnReasons?: Maybe<Array<Scalars['String']>>;
  review?: Maybe<Review>;
  reviewSummary?: Maybe<ReviewSummary>;
  reviews?: Maybe<ReviewRes>;
  role?: Maybe<Role>;
  roles?: Maybe<RoleRes>;
  salesByCustomer?: Maybe<Array<Maybe<SalesCustomerData>>>;
  salesByDay?: Maybe<Array<Maybe<SalesDayData>>>;
  salesByMonth?: Maybe<Array<Maybe<SalesMonthData>>>;
  salesByProduct?: Maybe<Array<Maybe<SalesProductData>>>;
  scheduleDemo?: Maybe<ScheduleDemo>;
  scheduleDemos?: Maybe<ScheduleDemoRes>;
  search?: Maybe<SearchRes>;
  settings?: Maybe<Setting>;
  settingsAdmin?: Maybe<Setting>;
  shippingMethod?: Maybe<ShippingMethod>;
  shippingMethods?: Maybe<ShippingMethodRes>;
  shippingProviders?: Maybe<Array<Scalars['String']>>;
  shippoAddressServiceable?: Maybe<Scalars['Boolean']>;
  shippoAddressServiceableOne?: Maybe<Scalars['Boolean']>;
  shippoCarriers?: Maybe<Scalars['Boolean']>;
  shippoLabels?: Maybe<ShippoLabelRes>;
  shutter?: Maybe<Scalars['Boolean']>;
  size?: Maybe<Size>;
  sizes?: Maybe<SizeRes>;
  slot?: Maybe<Slot>;
  slots?: Maybe<SlotRes>;
  sorts?: Maybe<Array<NameVal>>;
  startDeal?: Maybe<Scalars['Boolean']>;
  state?: Maybe<State>;
  states?: Maybe<StateRes>;
  statusSummary?: Maybe<Array<Maybe<StatusSummary>>>;
  store?: Maybe<OneStore>;
  storeCountries?: Maybe<StoreCountryRes>;
  storeCountry?: Maybe<StoreCountry>;
  storeCurrencies?: Maybe<StoreCurrencyRes>;
  storeCurrency?: Maybe<StoreCurrency>;
  storeLanguage?: Maybe<StoreLanguage>;
  storeLanguages?: Maybe<StoreLanguageRes>;
  storeOne?: Maybe<Store>;
  storeVendors?: Maybe<VendorRes>;
  stores?: Maybe<StoreRes>;
  subscribe?: Maybe<Subscribe>;
  subscribes?: Maybe<SubscribeRes>;
  subscription?: Maybe<SaasSubscription>;
  subscriptions?: Maybe<SubscriptionRes>;
  syncStores?: Maybe<Scalars['Boolean']>;
  tag?: Maybe<Tag>;
  tags?: Maybe<TagRes>;
  template?: Maybe<Template>;
  templates?: Maybe<TemplateRes>;
  timesList?: Maybe<Array<Scalars['String']>>;
  tokens?: Maybe<FcmTokenRes>;
  topVendors?: Maybe<Array<Maybe<Vendor>>>;
  transcodeVideo?: Maybe<Scalars['String']>;
  trending?: Maybe<Array<Maybe<Product>>>;
  unit?: Maybe<Unit>;
  units?: Maybe<UnitRes>;
  uploads?: Maybe<Array<Maybe<File>>>;
  user?: Maybe<UserOne>;
  userRoles?: Maybe<Array<Scalars['String']>>;
  userSummary?: Maybe<TodaysSummary>;
  users?: Maybe<UserRes>;
  validateCart?: Maybe<Scalars['Boolean']>;
  validateCoupon?: Maybe<Scalars['Boolean']>;
  variant?: Maybe<Variant>;
  variants?: Maybe<VariantRes>;
  vendor?: Maybe<Vendor>;
  vendor1?: Maybe<OneVendor>;
  vendor2?: Maybe<Vendor>;
  vendorOrders?: Maybe<OrderRes>;
  vendorProfile?: Maybe<Vendor>;
  vendorSummary?: Maybe<Array<Maybe<TodaysSummary>>>;
  vendors?: Maybe<VendorRes>;
  video?: Maybe<Video>;
  videos?: Maybe<VideoRes>;
  videosByIds?: Maybe<Array<Maybe<Video>>>;
  wallet?: Maybe<Wallet>;
  walletTransaction?: Maybe<WalletTransaction>;
  walletTransactions?: Maybe<WalletTransactionRes>;
  wallets?: Maybe<WalletRes>;
  wishlists?: Maybe<WishlistRes>;
  withdrawal?: Maybe<Withdrawal>;
  withdrawals?: Maybe<WithdrawalRes>;
  worldCurrencies?: Maybe<Array<Scalars['String']>>;
  youMayLike?: Maybe<Array<Maybe<Product>>>;
  zego?: Maybe<Zego>;
  zegoWhiteBoard?: Maybe<Zego>;
};


export type QueryAbandonedArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryAddressArgs = {
  id: Scalars['ID'];
};


export type QueryAddressesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryAllBannersArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  isLinkExternal?: InputMaybe<Scalars['Boolean']>;
  isMobile?: InputMaybe<Scalars['Boolean']>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  pageId?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryAllCategoriesArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  featured?: InputMaybe<Scalars['Boolean']>;
  level?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  megamenu?: InputMaybe<Scalars['Boolean']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  shopbycategory?: InputMaybe<Scalars['Boolean']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryAllOrdersArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
  today?: InputMaybe<Scalars['Boolean']>;
  user?: InputMaybe<Scalars['String']>;
  vendor?: InputMaybe<Scalars['String']>;
  where?: InputMaybe<Scalars['String']>;
};


export type QueryAllScheduleDemosArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  q?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryAllUsersArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  role?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryAppointmentArgs = {
  id: Scalars['String'];
};


export type QueryAppointmentsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryAttributeArgs = {
  id: Scalars['ID'];
};


export type QueryAttributeCategoriesArgs = {
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryAttributesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryBankTransferArgs = {
  id: Scalars['ID'];
};


export type QueryBankTransfersArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryBannerArgs = {
  id: Scalars['String'];
};


export type QueryBannerGroupArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  groupId: Scalars['String'];
  isLinkExternal?: InputMaybe<Scalars['Boolean']>;
  isMobile?: InputMaybe<Scalars['Boolean']>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  pageId?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryBannersArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  groupId?: InputMaybe<Scalars['String']>;
  groupTitle?: InputMaybe<Scalars['String']>;
  isLinkExternal?: InputMaybe<Scalars['Boolean']>;
  isMobile?: InputMaybe<Scalars['Boolean']>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  pageId?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryBestSellersArgs = {
  zip?: InputMaybe<Scalars['String']>;
};


export type QueryBlogArgs = {
  id: Scalars['String'];
};


export type QueryBlogsArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryBrandArgs = {
  id?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryBrand1Args = {
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryBrandsArgs = {
  featured?: InputMaybe<Scalars['Boolean']>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  parent?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryCartArgs = {
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryCart1Args = {
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryCartsArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryCategoriesArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  featured?: InputMaybe<Scalars['Boolean']>;
  img?: InputMaybe<Scalars['Boolean']>;
  level?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  megamenu?: InputMaybe<Scalars['Boolean']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  shopbycategory?: InputMaybe<Scalars['Boolean']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryCategoryArgs = {
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryCategoryAttributesArgs = {
  category: Scalars['ID'];
};


export type QueryCategorySimpleArgs = {
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryChannelArgs = {
  id: Scalars['ID'];
};


export type QueryChannel1Args = {
  id: Scalars['ID'];
};


export type QueryChannelMessagesArgs = {
  channel: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryChannelsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  q?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  upcoming?: InputMaybe<Scalars['Boolean']>;
  user?: InputMaybe<Scalars['ID']>;
};


export type QueryCheckWishlistArgs = {
  product: Scalars['ID'];
  variant: Scalars['ID'];
};


export type QueryCollectionArgs = {
  id: Scalars['ID'];
};


export type QueryCollectionsArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryCollectionsProductsArgs = {
  ids?: InputMaybe<Array<Scalars['ID']>>;
};


export type QueryColorArgs = {
  id: Scalars['ID'];
};


export type QueryColorsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryCountriesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryCountryArgs = {
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryCouponArgs = {
  id: Scalars['ID'];
};


export type QueryCouponsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryCouponsAdminArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryCurrenciesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryCurrencyArgs = {
  id: Scalars['ID'];
};


export type QueryCustomerMessageArgs = {
  id: Scalars['ID'];
};


export type QueryCustomerMessagesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryCustomersArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryDealArgs = {
  id: Scalars['ID'];
};


export type QueryDealOneArgs = {
  id: Scalars['ID'];
};


export type QueryDealsArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryDiscountArgs = {
  id: Scalars['ID'];
};


export type QueryDiscountsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryEndDealArgs = {
  id: Scalars['ID'];
};


export type QueryEventArgs = {
  id: Scalars['String'];
};


export type QueryEventOnDateArgs = {
  date: Scalars['String'];
  id: Scalars['String'];
};


export type QueryEventsArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryFaqArgs = {
  id: Scalars['String'];
};


export type QueryFaq1Args = {
  id: Scalars['ID'];
};


export type QueryFaqTopicArgs = {
  id: Scalars['String'];
};


export type QueryFaqTopicsArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryFaqsArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryFbProductArgs = {
  fbProductId: Scalars['String'];
};


export type QueryFeatureArgs = {
  id: Scalars['String'];
};


export type QueryFeaturesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryGGetProductArgs = {
  authCode: Scalars['String'];
  productId: Scalars['ID'];
};


export type QueryGListProductArgs = {
  authCode: Scalars['String'];
};


export type QueryGdprDataDeleteRequestsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryGetCartQtyArgs = {
  options?: InputMaybe<Scalars['String']>;
  pid: Scalars['ID'];
  vid?: InputMaybe<Scalars['ID']>;
};


export type QueryGetCoordinatesFromZipArgs = {
  zip: Scalars['String'];
};


export type QueryGetGdprDataDeleteRequestArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type QueryGetLocationArgs = {
  lat?: InputMaybe<Scalars['Float']>;
  lng?: InputMaybe<Scalars['Float']>;
};


export type QueryGetLocationFromZipArgs = {
  country: Scalars['String'];
  zip: Scalars['String'];
};


export type QueryGetLocationFromZipIndiaArgs = {
  zip: Scalars['String'];
};


export type QueryGetVariantArgs = {
  options?: InputMaybe<Array<InputMaybe<NameValIp>>>;
  pid: Scalars['ID'];
};


export type QueryGetVideoLinkArgs = {
  uri?: InputMaybe<Scalars['String']>;
};


export type QueryGlobalOptionArgs = {
  id: Scalars['ID'];
};


export type QueryGlobalOptionValueArgs = {
  id: Scalars['ID'];
};


export type QueryGlobalOptionValuesArgs = {
  global_option_id?: InputMaybe<Scalars['ID']>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryGlobalOptionsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryGroupByBannerArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  groupTitle?: InputMaybe<Scalars['String']>;
  pageId?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryGroupByBanner1Args = {
  groupTitle?: InputMaybe<Scalars['String']>;
  pageId?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryHasOrderArgs = {
  product: Scalars['ID'];
};


export type QueryImportDetailsArgs = {
  importNo?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  success?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  where?: InputMaybe<Scalars['String']>;
};


export type QueryInfluencerArgs = {
  id: Scalars['ID'];
};


export type QueryInfluencersArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  product: Scalars['ID'];
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryInvalidPriceArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  category?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryInvalidVendorArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  category?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryInventoriesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  product: Scalars['ID'];
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryInventoryArgs = {
  id: Scalars['ID'];
};


export type QueryIsSubscribedArgs = {
  subscriptionId?: InputMaybe<Scalars['ID']>;
};


export type QueryLanguageArgs = {
  id: Scalars['ID'];
};


export type QueryLanguagesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryListDealsArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryLocationArgs = {
  id: Scalars['String'];
};


export type QueryLocationsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryMaster_Id_ProductArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  productMasterId: Scalars['String'];
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryMediaArgs = {
  id: Scalars['ID'];
};


export type QueryMegamenuArgs = {
  brand?: InputMaybe<Scalars['ID']>;
  domain?: InputMaybe<Scalars['String']>;
  featured?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['ID']>;
  search?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryMegamenuAllArgs = {
  featured?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['ID']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryMyAddressesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryMyAppointmentsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryMyChannelsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  q?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryMyCustomersArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryMyDealsArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryMyOrderItemsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
  where?: InputMaybe<Scalars['String']>;
};


export type QueryMyOrdersArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
  where?: InputMaybe<Scalars['String']>;
};


export type QueryMyProductsArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  brand?: InputMaybe<Scalars['String']>;
  category?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  featured?: InputMaybe<Scalars['Boolean']>;
  hot?: InputMaybe<Scalars['Boolean']>;
  limit?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  new?: InputMaybe<Scalars['Boolean']>;
  page?: InputMaybe<Scalars['Int']>;
  parentBrand?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<Scalars['String']>;
  recommended?: InputMaybe<Scalars['Boolean']>;
  sale?: InputMaybe<Scalars['Boolean']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sku?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
  trending?: InputMaybe<Scalars['Boolean']>;
  type?: InputMaybe<Scalars['String']>;
  vendor?: InputMaybe<Scalars['String']>;
  where?: InputMaybe<Scalars['String']>;
};


export type QueryMyReferralsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryMyScheduleDemosArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  q?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryMySubscribesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryMyTagsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryMyTokensArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryMyVideosArgs = {
  category?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  subject?: InputMaybe<Scalars['String']>;
};


export type QueryMyWalletTransactionsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryMyWishlistArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryNeteaseTokenArgs = {
  channel?: InputMaybe<Scalars['String']>;
};


export type QueryNextProductArgs = {
  id: Scalars['ID'];
};


export type QueryNoDescriptionArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  category?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryNoImageArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  category?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryNoPriceArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  category?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryNoStockArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  category?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryOptionArgs = {
  id: Scalars['ID'];
};


export type QueryOptionValueArgs = {
  id: Scalars['ID'];
};


export type QueryOptionValuesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  option?: InputMaybe<Scalars['ID']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryOptionsArgs = {
  product: Scalars['ID'];
};


export type QueryOrderArgs = {
  id: Scalars['ID'];
};


export type QueryOrderItemArgs = {
  id: Scalars['ID'];
};


export type QueryOrderItemsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  today?: InputMaybe<Scalars['Boolean']>;
  user?: InputMaybe<Scalars['String']>;
  where?: InputMaybe<Scalars['String']>;
};


export type QueryOrderStatusArgs = {
  id: Scalars['ID'];
};


export type QueryOrderStatusOfOrderArgs = {
  order_id: Scalars['ID'];
};


export type QueryOrdersArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
  today?: InputMaybe<Scalars['Boolean']>;
  user?: InputMaybe<Scalars['String']>;
  vendor?: InputMaybe<Scalars['String']>;
  where?: InputMaybe<Scalars['String']>;
};


export type QueryOrdersByStatusArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  status: Scalars['String'];
};


export type QueryOrdersForPickupArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  status: Scalars['String'];
  vendor: Scalars['ID'];
};


export type QueryPageArgs = {
  id?: InputMaybe<Scalars['String']>;
};


export type QueryPageSlugArgs = {
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryPagesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryParentBrandsArgs = {
  featured?: InputMaybe<Scalars['Boolean']>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryPaymentArgs = {
  id: Scalars['ID'];
};


export type QueryPaymentMethodArgs = {
  id: Scalars['ID'];
};


export type QueryPaymentMethodSummaryArgs = {
  vendor?: InputMaybe<Scalars['ID']>;
};


export type QueryPaymentMethodsArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryPaymentMethodsAdminArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryPaymentsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryPickrrServiceabilityArgs = {
  fromAddressId: Scalars['ID'];
  toAddressId: Scalars['ID'];
};


export type QueryPopularArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  q?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
  zip?: InputMaybe<Scalars['String']>;
};


export type QueryPopularSearchArgs = {
  id: Scalars['ID'];
};


export type QueryPopularSearchesArgs = {
  domain?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryPrevProductArgs = {
  id: Scalars['ID'];
};


export type QueryProductArgs = {
  id: Scalars['ID'];
  optionValues?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  zip?: InputMaybe<Scalars['String']>;
};


export type QueryProduct1Args = {
  id: Scalars['ID'];
};


export type QueryProductEsArgs = {
  query?: InputMaybe<Scalars['String']>;
};


export type QueryProductFeaturesArgs = {
  product: Scalars['ID'];
};


export type QueryProductReviewsArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  pid: Scalars['ID'];
  q?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryProductSlugArgs = {
  slug: Scalars['String'];
};


export type QueryProduct_GroupArgs = {
  id: Scalars['ID'];
};


export type QueryProductsArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  brand?: InputMaybe<Scalars['String']>;
  category?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  featured?: InputMaybe<Scalars['Boolean']>;
  hot?: InputMaybe<Scalars['Boolean']>;
  limit?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  new?: InputMaybe<Scalars['Boolean']>;
  page?: InputMaybe<Scalars['Int']>;
  parentBrand?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<Scalars['String']>;
  recommended?: InputMaybe<Scalars['Boolean']>;
  sale?: InputMaybe<Scalars['Boolean']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sku?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
  trending?: InputMaybe<Scalars['Boolean']>;
  type?: InputMaybe<Scalars['String']>;
  types?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  vendor?: InputMaybe<Scalars['String']>;
  where?: InputMaybe<Scalars['String']>;
};


export type QueryProductsByIdsArgs = {
  ids?: InputMaybe<Array<Scalars['ID']>>;
};


export type QueryPromotionArgs = {
  id: Scalars['ID'];
};


export type QueryPromotionsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryPromotionsAdminArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryRandomVendorsArgs = {
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryRecommendedArgs = {
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryReferralArgs = {
  id: Scalars['ID'];
};


export type QueryReferralsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryReviewArgs = {
  id: Scalars['ID'];
};


export type QueryReviewSummaryArgs = {
  pid: Scalars['ID'];
};


export type QueryReviewsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  q?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryRoleArgs = {
  id: Scalars['ID'];
};


export type QueryRolesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryScheduleDemoArgs = {
  id: Scalars['ID'];
};


export type QueryScheduleDemosArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  q?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QuerySearchArgs = {
  country?: InputMaybe<Scalars['ID']>;
  foodType?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  location?: InputMaybe<Scalars['ID']>;
  page?: InputMaybe<Scalars['Int']>;
  q?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  zip?: InputMaybe<Scalars['String']>;
};


export type QueryShippingMethodArgs = {
  id: Scalars['ID'];
};


export type QueryShippingMethodsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  q?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryShippoAddressServiceableArgs = {
  addressId: Scalars['ID'];
};


export type QueryShippoAddressServiceableOneArgs = {
  address: AddressInput;
};


export type QueryShippoLabelsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
};


export type QuerySizeArgs = {
  id: Scalars['ID'];
};


export type QuerySizesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QuerySlotArgs = {
  id: Scalars['ID'];
};


export type QuerySlotsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryStartDealArgs = {
  id: Scalars['ID'];
};


export type QueryStateArgs = {
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryStatesArgs = {
  country?: InputMaybe<Scalars['ID']>;
  countryCode?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryStoreCountriesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  store: Scalars['ID'];
};


export type QueryStoreCountryArgs = {
  id: Scalars['ID'];
};


export type QueryStoreCurrenciesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  store: Scalars['ID'];
};


export type QueryStoreCurrencyArgs = {
  id: Scalars['ID'];
};


export type QueryStoreLanguageArgs = {
  id: Scalars['ID'];
};


export type QueryStoreLanguagesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  store: Scalars['ID'];
};


export type QueryStoreOneArgs = {
  domain?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryStoreVendorsArgs = {
  store: Scalars['ID'];
};


export type QueryStoresArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  featured?: InputMaybe<Scalars['Boolean']>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  vendor?: InputMaybe<Scalars['ID']>;
};


export type QuerySubscribeArgs = {
  id: Scalars['ID'];
};


export type QuerySubscribesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QuerySubscriptionArgs = {
  id: Scalars['ID'];
};


export type QuerySubscriptionsArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryTagArgs = {
  id: Scalars['ID'];
};


export type QueryTagsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryTemplateArgs = {
  id: Scalars['ID'];
};


export type QueryTemplatesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryTokensArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  user_type?: InputMaybe<Scalars['String']>;
};


export type QueryTopVendorsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryTranscodeVideoArgs = {
  uri?: InputMaybe<Scalars['String']>;
};


export type QueryTrendingArgs = {
  store?: InputMaybe<Scalars['ID']>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryUnitArgs = {
  id: Scalars['ID'];
};


export type QueryUnitsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryUserArgs = {
  id: Scalars['String'];
};


export type QueryUsersArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  role?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryVariantArgs = {
  id: Scalars['String'];
};


export type QueryVariantsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryVendorArgs = {
  id?: InputMaybe<Scalars['ID']>;
};


export type QueryVendor1Args = {
  id?: InputMaybe<Scalars['ID']>;
};


export type QueryVendor2Args = {
  id?: InputMaybe<Scalars['ID']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryVendorOrdersArgs = {
  status?: InputMaybe<Scalars['String']>;
  vendor: Scalars['ID'];
};


export type QueryVendorProfileArgs = {
  vendor: Scalars['ID'];
};


export type QueryVendorsArgs = {
  categories?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryVideoArgs = {
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QueryVideosArgs = {
  category?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  subject?: InputMaybe<Scalars['String']>;
};


export type QueryVideosByIdsArgs = {
  ids?: InputMaybe<Array<Scalars['ID']>>;
};


export type QueryWalletArgs = {
  id: Scalars['ID'];
};


export type QueryWalletTransactionArgs = {
  id: Scalars['ID'];
};


export type QueryWalletTransactionsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryWalletsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryWishlistsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
};


export type QueryWithdrawalArgs = {
  id: Scalars['ID'];
};


export type QueryWithdrawalsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type QueryYouMayLikeArgs = {
  store?: InputMaybe<Scalars['ID']>;
};

export type Referral = {
  __typename?: 'Referral';
  commissionAmount?: Maybe<Scalars['Float']>;
  commissionSettled?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  referredFrom?: Maybe<User>;
  referredTo?: Maybe<User>;
  storeCreated?: Maybe<Scalars['Boolean']>;
  subscribe?: Maybe<Subscribe>;
  subscribeAmount?: Maybe<Scalars['Float']>;
  subscriptionBought?: Maybe<Scalars['Boolean']>;
  walletTransaction?: Maybe<WalletTransaction>;
};

export type Refund = {
  __typename?: 'Refund';
  amount?: Maybe<Scalars['Float']>;
  message?: Maybe<Scalars['String']>;
  qty?: Maybe<Scalars['Int']>;
  refundId?: Maybe<Scalars['String']>;
  time?: Maybe<Scalars['String']>;
};

export type Review = {
  __typename?: 'Review';
  active?: Maybe<Scalars['Boolean']>;
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  message?: Maybe<Scalars['String']>;
  pid?: Maybe<Product>;
  rating?: Maybe<Scalars['Float']>;
  store?: Maybe<Store>;
  updatedAt: Scalars['String'];
  user?: Maybe<User>;
  variant?: Maybe<Variant>;
  vendor?: Maybe<Vendor>;
  votes?: Maybe<Vote>;
};

export type ReviewRes = {
  __typename?: 'ReviewRes';
  avg?: Maybe<Scalars['Float']>;
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Review>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
  total?: Maybe<Scalars['Float']>;
};

export type ReviewSetting = {
  __typename?: 'ReviewSetting';
  enabled?: Maybe<Scalars['Boolean']>;
  moderate?: Maybe<Scalars['Boolean']>;
};

export type ReviewSettingIp = {
  enabled?: InputMaybe<Scalars['Boolean']>;
  moderate?: InputMaybe<Scalars['Boolean']>;
};

export type ReviewSummary = {
  __typename?: 'ReviewSummary';
  avg?: Maybe<Scalars['Float']>;
  count?: Maybe<Scalars['Float']>;
  reviews?: Maybe<Array<Maybe<Scalars['String']>>>;
  total?: Maybe<Scalars['Float']>;
};

export type Role = {
  __typename?: 'Role';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  roles?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Rule = {
  __typename?: 'Rule';
  day?: Maybe<Scalars['String']>;
  enable?: Maybe<Scalars['Boolean']>;
  intervals?: Maybe<Array<Maybe<Interval>>>;
};

export type SaasSubscription = {
  __typename?: 'SaasSubscription';
  abandonnedCartRecovery?: Maybe<Scalars['Boolean']>;
  active?: Maybe<Scalars['Boolean']>;
  annualPrice?: Maybe<Scalars['Float']>;
  appointments?: Maybe<Scalars['Boolean']>;
  callMeLimit?: Maybe<Scalars['Int']>;
  cashfreePlanId?: Maybe<Scalars['String']>;
  chatSupport?: Maybe<Scalars['Boolean']>;
  createdAt?: Maybe<Scalars['String']>;
  customDomain?: Maybe<Scalars['Boolean']>;
  delivery?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
  discountCoupons?: Maybe<Scalars['Boolean']>;
  emailSupport?: Maybe<Scalars['Boolean']>;
  expertConsultation?: Maybe<Scalars['String']>;
  features?: Maybe<Array<Maybe<Scalars['String']>>>;
  freeSSL?: Maybe<Scalars['Boolean']>;
  homepageAdvertise?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  maxAdminAllowed?: Maybe<Scalars['Int']>;
  misReports?: Maybe<Scalars['Boolean']>;
  monthlyPrice?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
  onlineStore?: Maybe<Scalars['Boolean']>;
  photosAllowed?: Maybe<Scalars['Int']>;
  pickup?: Maybe<Scalars['Boolean']>;
  premiumSupport?: Maybe<Scalars['Boolean']>;
  productImportExport?: Maybe<Scalars['Boolean']>;
  productsAllowed?: Maybe<Scalars['Int']>;
  removeMisikiLogo?: Maybe<Scalars['Boolean']>;
  salesChannels?: Maybe<Scalars['Boolean']>;
  seoOptions?: Maybe<Scalars['Boolean']>;
  stripePlanId?: Maybe<Scalars['String']>;
  tableBooking?: Maybe<Scalars['Boolean']>;
  title?: Maybe<Scalars['String']>;
  transactionFees?: Maybe<Scalars['Float']>;
  transactionFeesType?: Maybe<Scalars['String']>;
  unlimitedProducts?: Maybe<Scalars['Boolean']>;
  unlimitedValidity?: Maybe<Scalars['Boolean']>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type ScheduleDemo = {
  __typename?: 'ScheduleDemo';
  id: Scalars['ID'];
  img?: Maybe<Scalars['String']>;
  imgCdn?: Maybe<Scalars['String']>;
  product?: Maybe<Product>;
  products?: Maybe<Array<Maybe<Product>>>;
  scheduleDateTime: Scalars['Float'];
  title?: Maybe<Scalars['String']>;
  user: User;
  users?: Maybe<Array<Maybe<User>>>;
};

export type ScheduleDemoOne = {
  __typename?: 'ScheduleDemoOne';
  id: Scalars['ID'];
  img?: Maybe<Scalars['String']>;
  imgCdn?: Maybe<Scalars['String']>;
  product?: Maybe<Scalars['ID']>;
  products?: Maybe<Array<Maybe<Scalars['ID']>>>;
  scheduleDateTime: Scalars['Float'];
  title?: Maybe<Scalars['String']>;
  user: Scalars['ID'];
  users?: Maybe<Array<Maybe<Scalars['ID']>>>;
};

export type ScheduleDemoRes = {
  __typename?: 'ScheduleDemoRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<ScheduleDemo>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type SearchRes = {
  __typename?: 'SearchRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Product>>>;
  noOfPage?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type Setting = {
  __typename?: 'Setting';
  ADMIN_PANEL_LINK?: Maybe<Scalars['String']>;
  CASHFREE_KEY_ID?: Maybe<Scalars['String']>;
  CDN_URL?: Maybe<Scalars['String']>;
  DOCS_LINK?: Maybe<Scalars['String']>;
  GOOGLE_CLIENT_ID?: Maybe<Scalars['String']>;
  IS_IMAGE_UPLOAD_REST?: Maybe<Scalars['Boolean']>;
  LIVE_COMMERCE_URL?: Maybe<Scalars['String']>;
  RAZORPAY_KEY_ID?: Maybe<Scalars['String']>;
  S3_URL?: Maybe<Scalars['String']>;
  WWW_URL?: Maybe<Scalars['String']>;
  adminNotifications?: Maybe<AdminNotification>;
  alert?: Maybe<Scalars['String']>;
  brainTreePublicKey?: Maybe<Scalars['String']>;
  closed?: Maybe<Scalars['Boolean']>;
  closedMessage?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['ID']>;
  countryDetails?: Maybe<Country>;
  currency?: Maybe<Scalars['ID']>;
  currencyCode?: Maybe<Scalars['String']>;
  currencyDecimals?: Maybe<Scalars['Int']>;
  currencyDetails?: Maybe<Currency>;
  currencySymbol?: Maybe<Scalars['String']>;
  customerOrderNotifications?: Maybe<UserNotification>;
  demo?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
  email?: Maybe<Email>;
  enableRazorpay?: Maybe<Scalars['Boolean']>;
  enableStripe?: Maybe<Scalars['Boolean']>;
  enableSubsription?: Maybe<Scalars['Boolean']>;
  enableTax?: Maybe<Scalars['Boolean']>;
  enableZips?: Maybe<Scalars['Boolean']>;
  facebook?: Maybe<Scalars['String']>;
  favicon?: Maybe<Scalars['String']>;
  foodTypes?: Maybe<Array<Maybe<NameValImg>>>;
  google?: Maybe<Scalars['String']>;
  googleMapsApi?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  instagram?: Maybe<Scalars['String']>;
  isMegamenu?: Maybe<Scalars['Boolean']>;
  isMultiStore?: Maybe<Scalars['Boolean']>;
  isMultiVendor?: Maybe<Scalars['Boolean']>;
  isSaas?: Maybe<Scalars['Boolean']>;
  isSearch?: Maybe<Scalars['Boolean']>;
  isVerifyEmail?: Maybe<Scalars['Boolean']>;
  joiningBonus?: Maybe<Scalars['Float']>;
  keywords?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['ID']>;
  langDetails?: Maybe<Language>;
  linkedin?: Maybe<Scalars['String']>;
  liveCommerce?: Maybe<Scalars['Boolean']>;
  locationExpiry?: Maybe<Scalars['Float']>;
  login?: Maybe<LoginSetting>;
  logo?: Maybe<Scalars['String']>;
  logoDark?: Maybe<Scalars['String']>;
  logoMobile?: Maybe<Scalars['String']>;
  logoMobileDark?: Maybe<Scalars['String']>;
  minimumOrderValue?: Maybe<Scalars['Int']>;
  multilingual?: Maybe<Scalars['Boolean']>;
  openGraphImage?: Maybe<Scalars['String']>;
  orderStatuses?: Maybe<Array<Maybe<OrderStatus>>>;
  otpLogin?: Maybe<Scalars['Boolean']>;
  pageSize?: Maybe<Scalars['Int']>;
  paymentMethods?: Maybe<Array<Maybe<PaymentMethod>>>;
  paymentStatuses?: Maybe<Array<Maybe<Scalars['String']>>>;
  product?: Maybe<ProductSetting>;
  referralBonus?: Maybe<Scalars['Float']>;
  returnReasons?: Maybe<Array<Maybe<Scalars['String']>>>;
  review?: Maybe<ReviewSetting>;
  searchbarText?: Maybe<Scalars['String']>;
  shipping?: Maybe<Shipping>;
  shippingProviders?: Maybe<Array<Maybe<Scalars['String']>>>;
  shopAddress?: Maybe<Scalars['String']>;
  shopPhone?: Maybe<Scalars['String']>;
  shutter?: Maybe<Shutter>;
  sms?: Maybe<Sms>;
  sorts?: Maybe<Array<Maybe<NameVal>>>;
  storage?: Maybe<Storage>;
  storageProvider?: Maybe<Scalars['String']>;
  stripePublishableKey?: Maybe<Scalars['String']>;
  tax?: Maybe<Tax>;
  title?: Maybe<Scalars['String']>;
  twitter?: Maybe<Scalars['String']>;
  userRoles?: Maybe<Array<Maybe<Scalars['String']>>>;
  walletThreshold?: Maybe<Scalars['Float']>;
  websiteEmail?: Maybe<Scalars['String']>;
  websiteLegalName?: Maybe<Scalars['String']>;
  websiteName?: Maybe<Scalars['String']>;
  zips?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Shipping = {
  __typename?: 'Shipping';
  charge?: Maybe<Scalars['Int']>;
  deliveryDays?: Maybe<Scalars['Int']>;
  enabled?: Maybe<Scalars['Boolean']>;
  free?: Maybe<Scalars['Int']>;
  method?: Maybe<Scalars['String']>;
  provider?: Maybe<Scalars['String']>;
};

export type ShippingIp = {
  charge?: InputMaybe<Scalars['Int']>;
  deliveryDays?: InputMaybe<Scalars['Int']>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  free?: InputMaybe<Scalars['Int']>;
  method?: InputMaybe<Scalars['String']>;
  provider?: InputMaybe<Scalars['String']>;
};

export type ShippingMethod = {
  __typename?: 'ShippingMethod';
  amount?: Maybe<Scalars['Float']>;
  carrierName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  maxWeight?: Maybe<Scalars['Float']>;
  method?: Maybe<Scalars['String']>;
  minWeight?: Maybe<Scalars['Float']>;
  shippingNameAtCheckout?: Maybe<Scalars['String']>;
  tableBasedOn?: Maybe<Scalars['String']>;
  user?: Maybe<Scalars['ID']>;
};

export type ShippingMethodRes = {
  __typename?: 'ShippingMethodRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<ShippingMethod>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type ShippoLabel = {
  __typename?: 'ShippoLabel';
  commercial_invoice_url?: Maybe<Scalars['String']>;
  eta?: Maybe<Scalars['String']>;
  label_url?: Maybe<Scalars['String']>;
  messages?: Maybe<Array<Maybe<ShippoMessage>>>;
  metadata?: Maybe<Scalars['String']>;
  object_created?: Maybe<Scalars['String']>;
  object_id?: Maybe<Scalars['String']>;
  object_state?: Maybe<Scalars['String']>;
  object_updated?: Maybe<Scalars['String']>;
  order?: Maybe<Scalars['String']>;
  parcel?: Maybe<Scalars['String']>;
  qr_code_url?: Maybe<Scalars['String']>;
  rate?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  test?: Maybe<Scalars['Boolean']>;
  tracking_number?: Maybe<Scalars['String']>;
  tracking_status?: Maybe<Scalars['String']>;
  tracking_url_provider?: Maybe<Scalars['String']>;
};

export type Shutter = {
  __typename?: 'Shutter';
  message?: Maybe<Scalars['String']>;
  open?: Maybe<Scalars['Boolean']>;
};

export type SippoShipment = {
  __typename?: 'SippoShipment';
  messages?: Maybe<Array<Maybe<ShippoMessage>>>;
  rates?: Maybe<Array<Maybe<SippoShipmentRates>>>;
};

export type SippoShipmentRates = {
  __typename?: 'SippoShipmentRates';
  amount?: Maybe<Scalars['Float']>;
  amount_local?: Maybe<Scalars['Float']>;
  arrives_by?: Maybe<Scalars['String']>;
  attributes?: Maybe<Array<Maybe<Scalars['String']>>>;
  carrier_account?: Maybe<Scalars['String']>;
  currency?: Maybe<Scalars['String']>;
  currency_local?: Maybe<Scalars['String']>;
  duration_terms?: Maybe<Scalars['String']>;
  estimated_days?: Maybe<Scalars['Int']>;
  messages?: Maybe<Array<Maybe<ShippoMessage>>>;
  object_created?: Maybe<Scalars['String']>;
  object_id?: Maybe<Scalars['String']>;
  provider?: Maybe<Scalars['String']>;
  provider_image_75?: Maybe<Scalars['String']>;
  provider_image_200?: Maybe<Scalars['String']>;
  servicelevel?: Maybe<ShippoServiceLevel>;
  shipment?: Maybe<Scalars['String']>;
  test?: Maybe<Scalars['Boolean']>;
  zone?: Maybe<Scalars['String']>;
};

export type Size = {
  __typename?: 'Size';
  active: Scalars['Boolean'];
  createdAt: Scalars['String'];
  featured?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  img?: Maybe<Scalars['String']>;
  imgCdn?: Maybe<Scalars['String']>;
  info?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  sort?: Maybe<Scalars['Float']>;
  store?: Maybe<Store>;
  updatedAt: Scalars['String'];
};

export type SizeGroup = {
  __typename?: 'SizeGroup';
  _id?: Maybe<Scalars['ID']>;
  size?: Maybe<Size>;
};

export type Slot = {
  __typename?: 'Slot';
  active?: Maybe<Scalars['Boolean']>;
  createdAt?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  info?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  store?: Maybe<Store>;
  updatedAt?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  value?: Maybe<Scalars['String']>;
};

export type SlotRes = {
  __typename?: 'SlotRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Slot>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type Sms = {
  __typename?: 'Sms';
  AUTO_VERIFICATION_ID?: Maybe<Scalars['String']>;
  enabled?: Maybe<Scalars['Boolean']>;
  provider?: Maybe<Scalars['String']>;
};

export type SmsIp = {
  AUTO_VERIFICATION_ID?: InputMaybe<Scalars['String']>;
  FAST2SMS_API_KEY?: InputMaybe<Scalars['String']>;
  Fast2SMS_OTP_TEMPLATE_ID?: InputMaybe<Scalars['Int']>;
  TWILIO_API_KEY?: InputMaybe<Scalars['String']>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  provider?: InputMaybe<Scalars['String']>;
};

export type State = {
  __typename?: 'State';
  active?: Maybe<Scalars['Boolean']>;
  code?: Maybe<Scalars['String']>;
  country?: Maybe<Country>;
  createdAt: Scalars['String'];
  flag?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  img?: Maybe<Scalars['String']>;
  imgCdn?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  slug?: Maybe<Scalars['String']>;
  sort?: Maybe<Scalars['Int']>;
  states?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type StatusSummary = {
  __typename?: 'StatusSummary';
  _id?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['Float']>;
  count?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['String']>;
};

export type Storage = {
  __typename?: 'Storage';
  enabled?: Maybe<Scalars['Boolean']>;
  provider?: Maybe<Scalars['String']>;
};

export type StorageIp = {
  enabled?: InputMaybe<Scalars['Boolean']>;
  provider?: InputMaybe<Scalars['String']>;
};

export type Store = {
  __typename?: 'Store';
  active?: Maybe<Scalars['Boolean']>;
  address?: Maybe<Scalars['String']>;
  adminNotifications?: Maybe<AdminNotification>;
  alert?: Maybe<Scalars['String']>;
  analyticsTrackingId?: Maybe<Scalars['String']>;
  bankAccountHolderName?: Maybe<Scalars['String']>;
  bankAccountNo?: Maybe<Scalars['String']>;
  bankIfscCode?: Maybe<Scalars['String']>;
  bankSwiftCode?: Maybe<Scalars['String']>;
  banners?: Maybe<Array<Maybe<Scalars['String']>>>;
  city?: Maybe<Scalars['String']>;
  closed?: Maybe<Scalars['Boolean']>;
  closedMessage?: Maybe<Scalars['String']>;
  country?: Maybe<Country>;
  createdAt?: Maybe<Scalars['String']>;
  currency?: Maybe<Currency>;
  currencyCode?: Maybe<Scalars['String']>;
  currencyDecimals?: Maybe<Scalars['Float']>;
  currencySuffix?: Maybe<Scalars['String']>;
  currencySymbol?: Maybe<Scalars['String']>;
  customerOrderNotifications?: Maybe<UserNotification>;
  description?: Maybe<Scalars['String']>;
  dimentionUnit?: Maybe<Scalars['String']>;
  domain?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  facebook?: Maybe<Scalars['String']>;
  facebookPixelId?: Maybe<Scalars['String']>;
  facebookUrl?: Maybe<Scalars['String']>;
  favicon?: Maybe<Scalars['String']>;
  faviconCdn?: Maybe<Scalars['String']>;
  featured?: Maybe<Scalars['Boolean']>;
  firstName?: Maybe<Scalars['String']>;
  freeShippingOn?: Maybe<Scalars['Float']>;
  gdpr?: Maybe<Scalars['Boolean']>;
  gdprCookieConsent?: Maybe<Scalars['String']>;
  google?: Maybe<Scalars['String']>;
  googleAdsTag?: Maybe<Scalars['String']>;
  hideDecimalInCurrency?: Maybe<Scalars['Boolean']>;
  homeMeta1?: Maybe<Scalars['String']>;
  homeMeta2?: Maybe<Scalars['String']>;
  homeMeta3?: Maybe<Scalars['String']>;
  homeMeta4?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  images?: Maybe<Array<Maybe<Scalars['String']>>>;
  imagesCdn?: Maybe<Array<Maybe<Scalars['String']>>>;
  img?: Maybe<Scalars['String']>;
  imgCdn?: Maybe<Scalars['String']>;
  instagram?: Maybe<Scalars['String']>;
  instagramUrl?: Maybe<Scalars['String']>;
  isCart?: Maybe<Scalars['Boolean']>;
  isFnb?: Maybe<Scalars['Boolean']>;
  isHideNilStock?: Maybe<Scalars['Boolean']>;
  isHyperlocal?: Maybe<Scalars['Boolean']>;
  isMegamenu?: Maybe<Scalars['Boolean']>;
  isOpen?: Maybe<Scalars['Boolean']>;
  isSearch?: Maybe<Scalars['Boolean']>;
  isWishlist?: Maybe<Scalars['Boolean']>;
  keywords?: Maybe<Scalars['String']>;
  lastAddedProduct?: Maybe<Product>;
  lastName?: Maybe<Scalars['String']>;
  lat?: Maybe<Scalars['Float']>;
  legalName?: Maybe<Scalars['String']>;
  linkedin?: Maybe<Scalars['String']>;
  lng?: Maybe<Scalars['Float']>;
  locality?: Maybe<Scalars['String']>;
  logo?: Maybe<Scalars['String']>;
  logoCdn?: Maybe<Scalars['String']>;
  logoDark?: Maybe<Scalars['String']>;
  logoDarkCdn?: Maybe<Scalars['String']>;
  logoMobile?: Maybe<Scalars['String']>;
  logoMobileCdn?: Maybe<Scalars['String']>;
  logoMobileDark?: Maybe<Scalars['String']>;
  logoMobileDarkCdn?: Maybe<Scalars['String']>;
  metaDescription?: Maybe<Scalars['String']>;
  minOrderValue?: Maybe<Scalars['Float']>;
  minimumOrderValue?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
  openGraphImage?: Maybe<Scalars['String']>;
  openGraphImageCdn?: Maybe<Scalars['String']>;
  pageSize?: Maybe<Scalars['Int']>;
  phone?: Maybe<Scalars['String']>;
  pickrrAuthToken?: Maybe<Scalars['String']>;
  pinterestTag?: Maybe<Scalars['String']>;
  pinterestUrl?: Maybe<Scalars['String']>;
  priceDisplayFormat?: Maybe<Scalars['String']>;
  qrCode?: Maybe<Scalars['String']>;
  review?: Maybe<ReviewSetting>;
  searchbarText?: Maybe<Scalars['String']>;
  shipRocketChannelId?: Maybe<Scalars['String']>;
  shipRocketEmail?: Maybe<Scalars['String']>;
  shipRocketPassword?: Maybe<Scalars['String']>;
  shipping?: Maybe<Shipping>;
  shippingCharge?: Maybe<Scalars['Float']>;
  shippoToken?: Maybe<Scalars['String']>;
  shopAddress?: Maybe<Scalars['String']>;
  shopPhone?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  sms?: Maybe<Sms>;
  snapChatPixel?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  storeCountry?: Maybe<StoreCountry>;
  storeCurrency?: Maybe<StoreCurrency>;
  storeId?: Maybe<Scalars['String']>;
  storeLanguage?: Maybe<StoreLanguage>;
  storeTiming?: Maybe<Array<Maybe<StoreTiming>>>;
  timeDisplayFormat?: Maybe<Scalars['String']>;
  timeZone?: Maybe<Scalars['String']>;
  timing?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  totalProducts?: Maybe<Scalars['Int']>;
  twitter?: Maybe<Scalars['String']>;
  twitterUrl?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  vendorNotifications?: Maybe<VendorNotification>;
  webmail?: Maybe<Scalars['String']>;
  websiteEmail?: Maybe<Scalars['String']>;
  websiteLegalName?: Maybe<Scalars['String']>;
  websiteName?: Maybe<Scalars['String']>;
  weightUnit?: Maybe<Scalars['String']>;
  youtubeUrl?: Maybe<Scalars['String']>;
  zip?: Maybe<Scalars['String']>;
};

export type StoreCountry = {
  __typename?: 'StoreCountry';
  active?: Maybe<Scalars['Boolean']>;
  code?: Maybe<Scalars['String']>;
  country?: Maybe<Country>;
  createdAt?: Maybe<Scalars['String']>;
  default?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  store?: Maybe<Store>;
  updatedAt?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type StoreCountryRes = {
  __typename?: 'StoreCountryRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<StoreCountry>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type StoreCurrency = {
  __typename?: 'StoreCurrency';
  active?: Maybe<Scalars['Boolean']>;
  conversionMode?: Maybe<Scalars['String']>;
  conversionRate?: Maybe<Scalars['Float']>;
  createdAt?: Maybe<Scalars['String']>;
  currency?: Maybe<Currency>;
  decimalDigits?: Maybe<Scalars['Int']>;
  default?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['ID']>;
  isoCode?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  store?: Maybe<Store>;
  symbol?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type StoreCurrencyRes = {
  __typename?: 'StoreCurrencyRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<StoreCurrency>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type StoreLanguage = {
  __typename?: 'StoreLanguage';
  active?: Maybe<Scalars['Boolean']>;
  code?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  default?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['ID']>;
  lang?: Maybe<Language>;
  name?: Maybe<Scalars['String']>;
  store?: Maybe<Store>;
  updatedAt?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type StoreLanguageRes = {
  __typename?: 'StoreLanguageRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<StoreLanguage>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type StoreTiming = {
  __typename?: 'StoreTiming';
  day?: Maybe<Scalars['String']>;
  fromTime?: Maybe<Scalars['String']>;
  index?: Maybe<Scalars['Int']>;
  isOpen?: Maybe<Scalars['Boolean']>;
  online?: Maybe<Scalars['Boolean']>;
  toTime?: Maybe<Scalars['String']>;
};

export type Subscribe = {
  __typename?: 'Subscribe';
  EndTime?: Maybe<Scalars['String']>;
  EndTimeISO?: Maybe<Scalars['String']>;
  StartTime?: Maybe<Scalars['String']>;
  StartTimeISO?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['Float']>;
  amountDue?: Maybe<Scalars['Float']>;
  amountPaid?: Maybe<Scalars['Float']>;
  authLink?: Maybe<Scalars['String']>;
  clientSecret?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  daysLeft?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  img?: Maybe<Scalars['String']>;
  onGoing?: Maybe<Scalars['Boolean']>;
  paid?: Maybe<Scalars['Boolean']>;
  payment?: Maybe<Payment>;
  paymentReferenceId?: Maybe<Scalars['String']>;
  subscription?: Maybe<SaasSubscription>;
  updatedAt?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type Subscription = {
  __typename?: 'Subscription';
  _?: Maybe<Scalars['String']>;
  chats?: Maybe<InstantMessageRes>;
  messageReceived?: Maybe<InstantMessage>;
  orderUpdated?: Maybe<Order>;
  settingsUpdated?: Maybe<Setting>;
};


export type SubscriptionChatsArgs = {
  channel: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type SubscriptionMessageReceivedArgs = {
  channel: Scalars['String'];
};


export type SubscriptionOrderUpdatedArgs = {
  id: Scalars['ID'];
};

export type Tc = {
  __typename?: 'TC';
  _id?: Maybe<TodaysVendors>;
  amount?: Maybe<Scalars['Int']>;
  count?: Maybe<Scalars['Int']>;
};

export type Tag = {
  __typename?: 'Tag';
  active?: Maybe<Scalars['Boolean']>;
  colorCode?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  store?: Maybe<Store>;
  updatedAt: Scalars['String'];
  user?: Maybe<User>;
};

export type Tax = {
  __typename?: 'Tax';
  cgst?: Maybe<Scalars['Float']>;
  igst?: Maybe<Scalars['Float']>;
  sgst?: Maybe<Scalars['Float']>;
};

export type TaxIp = {
  cgst?: InputMaybe<Scalars['Float']>;
  igst?: InputMaybe<Scalars['Float']>;
  sgst?: InputMaybe<Scalars['Float']>;
};

export type Template = {
  __typename?: 'Template';
  active?: Maybe<Scalars['Boolean']>;
  content?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  fileName?: Maybe<Scalars['String']>;
  folder?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  iconCdn?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  store?: Maybe<Store>;
  templateId?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  user?: Maybe<User>;
  variables?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type TemplateRes = {
  __typename?: 'TemplateRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Template>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type TodaysSummary = {
  __typename?: 'TodaysSummary';
  _id?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['Float']>;
  codPaid?: Maybe<Scalars['Float']>;
  count?: Maybe<Scalars['Float']>;
  createdAt?: Maybe<Scalars['String']>;
};

export type UniqueCode = {
  __typename?: 'UniqueCode';
  uniqueCode?: Maybe<Scalars['String']>;
  used?: Maybe<Scalars['Int']>;
};

export type Unit = {
  __typename?: 'Unit';
  active: Scalars['Boolean'];
  createdAt: Scalars['String'];
  featured?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  img?: Maybe<Scalars['String']>;
  info?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
};

export type UploadedFileResponse = {
  __typename?: 'UploadedFileResponse';
  encoding: Scalars['String'];
  filename: Scalars['String'];
  mimetype: Scalars['String'];
  url: Scalars['String'];
};

export type UsedOption = {
  __typename?: 'UsedOption';
  dates?: Maybe<Array<Maybe<Scalars['String']>>>;
  name?: Maybe<Scalars['String']>;
  val?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type User = {
  __typename?: 'User';
  _id?: Maybe<Scalars['ID']>;
  active?: Maybe<Scalars['Boolean']>;
  address?: Maybe<Array<Maybe<Address>>>;
  appleId?: Maybe<Scalars['String']>;
  avatar?: Maybe<Scalars['String']>;
  avatarCdn?: Maybe<Scalars['String']>;
  banner?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  currentBalance?: Maybe<Scalars['Float']>;
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  freeShippingOn?: Maybe<Scalars['Int']>;
  fullName?: Maybe<Scalars['String']>;
  gender?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  info?: Maybe<Info>;
  lastName?: Maybe<Scalars['String']>;
  luluCustomerNo?: Maybe<Scalars['String']>;
  meta?: Maybe<Scalars['String']>;
  metaDescription?: Maybe<Scalars['String']>;
  metaKeywords?: Maybe<Scalars['String']>;
  metaTitle?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  phoneVerified?: Maybe<Scalars['Boolean']>;
  plan?: Maybe<Scalars['String']>;
  productSold?: Maybe<Scalars['Int']>;
  provider?: Maybe<Scalars['String']>;
  ratings?: Maybe<Scalars['Float']>;
  referralCode?: Maybe<Scalars['String']>;
  reviews?: Maybe<Scalars['Float']>;
  role?: Maybe<Scalars['String']>;
  roles?: Maybe<Array<Maybe<Scalars['ID']>>>;
  shippingCharges?: Maybe<Scalars['Int']>;
  sid?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  store?: Maybe<Store>;
  storeCommissionType?: Maybe<Scalars['String']>;
  storeCommissionValue?: Maybe<Scalars['Float']>;
  storeName?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  vendor?: Maybe<Scalars['ID']>;
  verified?: Maybe<Scalars['Boolean']>;
  verifiedAt?: Maybe<Scalars['String']>;
};

export type UserIp = {
  firstName?: InputMaybe<Scalars['String']>;
  info?: InputMaybe<InputInfo>;
  lastName?: InputMaybe<Scalars['String']>;
};

export type UserNotification = {
  __typename?: 'UserNotification';
  downloadEGoods?: Maybe<Scalars['Boolean']>;
  giftCardPurchased?: Maybe<Scalars['Boolean']>;
  orderConfirmation?: Maybe<Scalars['Boolean']>;
  orderConfirmationSms?: Maybe<Scalars['Boolean']>;
  orderIsReadyForPickup?: Maybe<Scalars['Boolean']>;
  orderShipped?: Maybe<Scalars['Boolean']>;
  orderStatusChanged?: Maybe<Scalars['Boolean']>;
};

export type UserNotificationIp = {
  downloadEGoods?: InputMaybe<Scalars['Boolean']>;
  giftCardPurchased?: InputMaybe<Scalars['Boolean']>;
  orderConfirmation?: InputMaybe<Scalars['Boolean']>;
  orderConfirmationSms?: InputMaybe<Scalars['Boolean']>;
  orderIsReadyForPickup?: InputMaybe<Scalars['Boolean']>;
  orderShipped?: InputMaybe<Scalars['Boolean']>;
  orderStatusChanged?: InputMaybe<Scalars['Boolean']>;
};

export type UserOne = {
  __typename?: 'UserOne';
  _id?: Maybe<Scalars['ID']>;
  active?: Maybe<Scalars['Boolean']>;
  address?: Maybe<Array<Maybe<Address>>>;
  appleId?: Maybe<Scalars['String']>;
  avatar?: Maybe<Scalars['String']>;
  avatarCdn?: Maybe<Scalars['String']>;
  banner?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  currentBalance?: Maybe<Scalars['Float']>;
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  freeShippingOn?: Maybe<Scalars['Int']>;
  fullName?: Maybe<Scalars['String']>;
  gender?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  info?: Maybe<Info>;
  lastName?: Maybe<Scalars['String']>;
  luluCustomerNo?: Maybe<Scalars['String']>;
  meta?: Maybe<Scalars['String']>;
  metaDescription?: Maybe<Scalars['String']>;
  metaKeywords?: Maybe<Scalars['String']>;
  metaTitle?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  phoneVerified?: Maybe<Scalars['Boolean']>;
  plan?: Maybe<Scalars['String']>;
  productSold?: Maybe<Scalars['Int']>;
  provider?: Maybe<Scalars['String']>;
  ratings?: Maybe<Scalars['Float']>;
  recentlyViewed?: Maybe<Array<Maybe<Scalars['ID']>>>;
  referralCode?: Maybe<Scalars['String']>;
  reviews?: Maybe<Scalars['Float']>;
  role?: Maybe<Scalars['String']>;
  roles?: Maybe<Array<Maybe<Role>>>;
  shippingCharges?: Maybe<Scalars['Int']>;
  sid?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  store?: Maybe<Scalars['ID']>;
  storeCommissionType?: Maybe<Scalars['String']>;
  storeCommissionValue?: Maybe<Scalars['Float']>;
  storeName?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  vendor?: Maybe<Scalars['ID']>;
  verified?: Maybe<Scalars['Boolean']>;
  verifiedAt?: Maybe<Scalars['String']>;
};

export type ValueIp = {
  default?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  position?: InputMaybe<Scalars['Int']>;
  slug?: InputMaybe<Scalars['String']>;
};

export type Variant = {
  __typename?: 'Variant';
  active?: Maybe<Scalars['Boolean']>;
  barcode?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  dimensionUnit?: Maybe<Scalars['String']>;
  discount?: Maybe<Scalars['Float']>;
  enableUnitPrice?: Maybe<Scalars['Boolean']>;
  height?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  images?: Maybe<Array<Maybe<Scalars['String']>>>;
  img?: Maybe<Scalars['String']>;
  length?: Maybe<Scalars['Float']>;
  mrp?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
  options?: Maybe<Array<Maybe<Option>>>;
  price?: Maybe<Scalars['Float']>;
  saleFromDate?: Maybe<Scalars['String']>;
  saleToDate?: Maybe<Scalars['String']>;
  sku?: Maybe<Scalars['String']>;
  sort?: Maybe<Scalars['Int']>;
  stock?: Maybe<Scalars['Float']>;
  trackInventory?: Maybe<Scalars['Boolean']>;
  unit?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  weight?: Maybe<Scalars['Float']>;
  width?: Maybe<Scalars['Float']>;
};

export type VariantIp = {
  active?: InputMaybe<Scalars['Boolean']>;
  barcode?: InputMaybe<Scalars['String']>;
  color?: InputMaybe<Scalars['String']>;
  dimensionUnit?: InputMaybe<Scalars['String']>;
  discount?: InputMaybe<Scalars['Float']>;
  enableUnitPrice?: InputMaybe<Scalars['Boolean']>;
  height?: InputMaybe<Scalars['Float']>;
  id?: InputMaybe<Scalars['ID']>;
  images?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  img?: InputMaybe<Scalars['String']>;
  length?: InputMaybe<Scalars['Float']>;
  mrp?: InputMaybe<Scalars['Float']>;
  name?: InputMaybe<Scalars['String']>;
  options?: InputMaybe<Array<InputMaybe<NameValIp>>>;
  price?: InputMaybe<Scalars['Float']>;
  saleFromDate?: InputMaybe<Scalars['String']>;
  saleToDate?: InputMaybe<Scalars['String']>;
  sku?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['Int']>;
  stock?: InputMaybe<Scalars['Float']>;
  trackInventory?: InputMaybe<Scalars['Boolean']>;
  unit?: InputMaybe<Scalars['String']>;
  weight?: InputMaybe<Scalars['Float']>;
  width?: InputMaybe<Scalars['Float']>;
};

export type Vendor = {
  __typename?: 'Vendor';
  about?: Maybe<Scalars['String']>;
  address?: Maybe<Address>;
  bankAccountHolderName?: Maybe<Scalars['String']>;
  bankAccountNo?: Maybe<Scalars['Float']>;
  bankIfsc?: Maybe<Scalars['String']>;
  bankName?: Maybe<Scalars['String']>;
  bankSwiftCode?: Maybe<Scalars['String']>;
  banner?: Maybe<Scalars['String']>;
  bannerCdn?: Maybe<Scalars['String']>;
  banners?: Maybe<Array<Maybe<Scalars['String']>>>;
  bannersCdn?: Maybe<Array<Maybe<Scalars['String']>>>;
  businessName?: Maybe<Scalars['String']>;
  categories?: Maybe<Array<Maybe<Category>>>;
  commissionType?: Maybe<Scalars['String']>;
  commissionValue?: Maybe<Scalars['Float']>;
  country?: Maybe<Country>;
  createdAt?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  facebookUrl?: Maybe<Scalars['String']>;
  freeShippingOn?: Maybe<Scalars['Float']>;
  githubUrl?: Maybe<Scalars['String']>;
  googleUrl?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  info?: Maybe<Info>;
  meta?: Maybe<Scalars['String']>;
  metaDescription?: Maybe<Scalars['String']>;
  metaKeywords?: Maybe<Scalars['String']>;
  metaTitle?: Maybe<Scalars['String']>;
  productSold?: Maybe<Scalars['Int']>;
  products?: Maybe<SearchRes>;
  ratings?: Maybe<Scalars['Float']>;
  reviews?: Maybe<Scalars['Int']>;
  shippingCharges?: Maybe<Scalars['Float']>;
  slug?: Maybe<Scalars['String']>;
  store?: Maybe<Store>;
  storeName?: Maybe<Scalars['String']>;
  twitterUrl?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  verified?: Maybe<Scalars['Boolean']>;
  zips?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type VendorNotification = {
  __typename?: 'VendorNotification';
  orderConfirmationSms?: Maybe<Scalars['Boolean']>;
};

export type VendorNotificationIp = {
  orderConfirmationSms?: InputMaybe<Scalars['Boolean']>;
};

export type Video = {
  __typename?: 'Video';
  active?: Maybe<Scalars['Boolean']>;
  category?: Maybe<Scalars['String']>;
  channelId?: Maybe<Scalars['Float']>;
  channelName?: Maybe<Scalars['String']>;
  cid?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  comment?: Maybe<Scalars['String']>;
  completeTime?: Maybe<Scalars['Float']>;
  createTime?: Maybe<Scalars['Float']>;
  createdAt?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  downloadHdMp4Url?: Maybe<Scalars['String']>;
  downloadOrigUrl?: Maybe<Scalars['String']>;
  downloadSdFlvUrl?: Maybe<Scalars['String']>;
  downloadSdMp4Url?: Maybe<Scalars['String']>;
  downloadShdMp4Url?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['Int']>;
  durationMsec?: Maybe<Scalars['String']>;
  eventType?: Maybe<Scalars['String']>;
  featured?: Maybe<Scalars['Boolean']>;
  filename?: Maybe<Scalars['String']>;
  hdMp4Size?: Maybe<Scalars['Float']>;
  hdMp4Url?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  img?: Maybe<Scalars['String']>;
  initialSize?: Maybe<Scalars['String']>;
  md5?: Maybe<Scalars['String']>;
  mix?: Maybe<Scalars['String']>;
  origUrl?: Maybe<Scalars['String']>;
  pieceIndex?: Maybe<Scalars['Int']>;
  playSupport?: Maybe<Scalars['String']>;
  reason?: Maybe<Scalars['String']>;
  sdFlvSize?: Maybe<Scalars['Float']>;
  sdFlvUrl?: Maybe<Scalars['String']>;
  sdMp4Size?: Maybe<Scalars['Float']>;
  sdMp4Url?: Maybe<Scalars['String']>;
  shdMp4Size?: Maybe<Scalars['Float']>;
  shdMp4Url?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['String']>;
  snapshotUrl?: Maybe<Scalars['String']>;
  sort?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['Float']>;
  streamUrl?: Maybe<Scalars['String']>;
  substream?: Maybe<Scalars['Boolean']>;
  taskId?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['Float']>;
  type?: Maybe<Scalars['String']>;
  typeId?: Maybe<Scalars['Float']>;
  typeName?: Maybe<Scalars['String']>;
  uid?: Maybe<Scalars['Float']>;
  updateTime?: Maybe<Scalars['Float']>;
  updatedAt?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  vid?: Maybe<Scalars['String']>;
  videoName?: Maybe<Scalars['String']>;
  views?: Maybe<Scalars['Int']>;
};

export type Vote = {
  __typename?: 'Vote';
  count: Scalars['Float'];
  voters: Array<User>;
};

export type Wallet = {
  __typename?: 'Wallet';
  balance?: Maybe<Scalars['Float']>;
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  updatedAt?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type WalletRes = {
  __typename?: 'WalletRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Wallet>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type WalletTransaction = {
  __typename?: 'WalletTransaction';
  amount?: Maybe<Scalars['Float']>;
  balanceAfter?: Maybe<Scalars['Float']>;
  balanceBefore?: Maybe<Scalars['Float']>;
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  purpose?: Maybe<Scalars['String']>;
  reference?: Maybe<Scalars['String']>;
  referenceId?: Maybe<Scalars['String']>;
  referenceTable?: Maybe<Scalars['String']>;
  summary?: Maybe<Scalars['String']>;
  trnxSummary?: Maybe<Scalars['String']>;
  trnxType?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  wallet?: Maybe<Wallet>;
};

export type WalletTransactionRes = {
  __typename?: 'WalletTransactionRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<OneWalletTransaction>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type Wishlist = {
  __typename?: 'Wishlist';
  active?: Maybe<Scalars['Boolean']>;
  createdAt?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  product?: Maybe<Product>;
  store?: Maybe<Store>;
  updatedAt?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  variant?: Maybe<Product>;
};

export type Withdrawal = {
  __typename?: 'Withdrawal';
  amount?: Maybe<Scalars['Float']>;
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  remark?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  wallet?: Maybe<Wallet>;
};

export type WithdrawalRes = {
  __typename?: 'WithdrawalRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Withdrawal>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type Zego = {
  __typename?: 'Zego';
  appID?: Maybe<Scalars['Float']>;
  roomID?: Maybe<Scalars['String']>;
  server?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
  userID?: Maybe<Scalars['String']>;
  userName?: Maybe<Scalars['String']>;
};

export type AddressRes = {
  __typename?: 'addressRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Address>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type AppointmentRes = {
  __typename?: 'appointmentRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Appointment>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type AttributeRes = {
  __typename?: 'attributeRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Attribute>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type BankTransferRes = {
  __typename?: 'bankTransferRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<BankTransfer>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type BannerGroup = {
  __typename?: 'bannerGroup';
  _id?: Maybe<BgData>;
  data?: Maybe<Array<Maybe<OneBanner>>>;
};

export type BannerGroup1 = {
  __typename?: 'bannerGroup1';
  _id?: Maybe<Scalars['String']>;
  data?: Maybe<Array<Maybe<OneBanner>>>;
};

export type BannerRes = {
  __typename?: 'bannerRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<OneBanner>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type BgData = {
  __typename?: 'bgData';
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type BlogRes = {
  __typename?: 'blogRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Blog>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type BrandRes = {
  __typename?: 'brandRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Brand>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type CartRes = {
  __typename?: 'cartRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Cart>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type CategoryRes = {
  __typename?: 'categoryRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Category>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type CategoryResSimple = {
  __typename?: 'categoryResSimple';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<CategorySimple>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type CollectionRes = {
  __typename?: 'collectionRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<CollectionOne>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type ColorRes = {
  __typename?: 'colorRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Color>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type CountryRes = {
  __typename?: 'countryRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Country>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type CouponRes = {
  __typename?: 'couponRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Coupon>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type CurrencyRes = {
  __typename?: 'currencyRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Currency>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type Delivery = {
  __typename?: 'delivery';
  all?: Maybe<DeliveryGroup>;
  cancelled?: Maybe<DeliveryGroup>;
  delivered?: Maybe<DeliveryGroup>;
  out?: Maybe<DeliveryGroup>;
  pending?: Maybe<DeliveryGroup>;
};

export type DiscountRes = {
  __typename?: 'discountRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Discount>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type EventOne = {
  __typename?: 'eventOne';
  active?: Maybe<Scalars['Boolean']>;
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  rules?: Maybe<Array<Maybe<Rule>>>;
  updatedAt: Scalars['String'];
  user?: Maybe<Scalars['ID']>;
};

export type EventRes = {
  __typename?: 'eventRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Event>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type FaqOne = {
  __typename?: 'faqOne';
  active?: Maybe<Scalars['Boolean']>;
  answer?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  opened?: Maybe<Scalars['Boolean']>;
  question?: Maybe<Scalars['String']>;
  store?: Maybe<Scalars['ID']>;
  topic?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
};

export type FaqRes = {
  __typename?: 'faqRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Faq>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type FaqTopicRes = {
  __typename?: 'faqTopicRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<FaqTopic>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type FcmTokenRes = {
  __typename?: 'fcmTokenRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<FcmToken>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type FeatureRes = {
  __typename?: 'featureRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Feature>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type FileRes = {
  __typename?: 'fileRes';
  encoding?: Maybe<Scalars['String']>;
  filename?: Maybe<Scalars['String']>;
  mimetype?: Maybe<Scalars['String']>;
  productCount?: Maybe<Scalars['Int']>;
  url?: Maybe<Scalars['String']>;
};

export type GdprDataDeleteRequestRes = {
  __typename?: 'gdprDataDeleteRequestRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<GdprDataDeleteRequest>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type GlobalOptionRes = {
  __typename?: 'globalOptionRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<GlobalOption>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type GlobalOptionValueRes = {
  __typename?: 'globalOptionValueRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<GlobalOptionValue>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type ImportDetailRes = {
  __typename?: 'importDetailRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<ImportDetail>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type IntervalIp = {
  from?: InputMaybe<Scalars['String']>;
  to?: InputMaybe<Scalars['String']>;
};

export type InventoryRes = {
  __typename?: 'inventoryRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Inventory>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type LanguageRes = {
  __typename?: 'languageRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Language>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type LocationRes = {
  __typename?: 'locationRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Location>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type MyCustomer = {
  __typename?: 'myCustomer';
  _id?: Maybe<Order>;
  items?: Maybe<Array<Maybe<CartItem>>>;
  total?: Maybe<Scalars['Int']>;
};

export type MyCustomerRes = {
  __typename?: 'myCustomerRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<MyCustomer>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type NeteaseVideoRes = {
  __typename?: 'neteaseVideoRes';
  currentPage?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<NeteaseVideo>>>;
  pageNum?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
  totalRecords?: Maybe<Scalars['Int']>;
};

export type OptionRes = {
  __typename?: 'optionRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Option>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type OptionValueRes = {
  __typename?: 'optionValueRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<OptionValue>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type OrderItemRes = {
  __typename?: 'orderItemRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<OrderItem>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type OrderRes = {
  __typename?: 'orderRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Order>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type PageRes = {
  __typename?: 'pageRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Page>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type PaymentTypeData = {
  __typename?: 'paymentTypeData';
  _id?: Maybe<Scalars['String']>;
  qty?: Maybe<Scalars['Int']>;
  totalAmount?: Maybe<Scalars['Float']>;
};

export type ProdEs = {
  __typename?: 'prodEs';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<ProdEsData>>>;
  took?: Maybe<Scalars['Int']>;
};

export type ProdEsData = {
  __typename?: 'prodEsData';
  _id?: Maybe<Scalars['String']>;
  _index?: Maybe<Scalars['String']>;
  _score?: Maybe<Scalars['Int']>;
  _source?: Maybe<Product>;
  _type?: Maybe<Scalars['String']>;
};

export type PromotionRes = {
  __typename?: 'promotionRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Promotion>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type ReferralRes = {
  __typename?: 'referralRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Referral>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type RoleRes = {
  __typename?: 'roleRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Role>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type RuleIp = {
  day?: InputMaybe<Scalars['String']>;
  enable?: InputMaybe<Scalars['Boolean']>;
  intervals?: InputMaybe<Array<InputMaybe<IntervalIp>>>;
};

export type SalesCustomerData = {
  __typename?: 'salesCustomerData';
  _id?: Maybe<User>;
  qty?: Maybe<Scalars['Int']>;
  totalAmount?: Maybe<Scalars['Float']>;
};

export type SalesData = {
  __typename?: 'salesData';
  _id?: Maybe<Scalars['String']>;
  qty?: Maybe<Scalars['Int']>;
  total?: Maybe<Scalars['Float']>;
};

export type SalesDayData = {
  __typename?: 'salesDayData';
  _id?: Maybe<Scalars['String']>;
  qty?: Maybe<Scalars['Int']>;
  totalAmount?: Maybe<Scalars['Float']>;
};

export type SalesMonthData = {
  __typename?: 'salesMonthData';
  _id?: Maybe<Scalars['String']>;
  qty?: Maybe<Scalars['Int']>;
  totalAmount?: Maybe<Scalars['Float']>;
};

export type SalesProductData = {
  __typename?: 'salesProductData';
  _id?: Maybe<Product>;
  qty?: Maybe<Scalars['Int']>;
  totalAmount?: Maybe<Scalars['Float']>;
};

export type ShippoLabelRes = {
  __typename?: 'shippoLabelRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<ShippoLabel>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type ShippoMessage = {
  __typename?: 'shippoMessage';
  code?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
};

export type ShippoServiceLevel = {
  __typename?: 'shippoServiceLevel';
  extended_token?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  parent_servicelevel?: Maybe<Scalars['String']>;
  terms?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};

export type SizeRes = {
  __typename?: 'sizeRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Size>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type StateRes = {
  __typename?: 'stateRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<State>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type StoreRes = {
  __typename?: 'storeRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Store>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type SubscribeRes = {
  __typename?: 'subscribeRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Subscribe>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type SubscriptionRes = {
  __typename?: 'subscriptionRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<SaasSubscription>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type TagRes = {
  __typename?: 'tagRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Tag>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type TodaysVendors = {
  __typename?: 'todaysVendors';
  address?: Maybe<Address>;
  firstName?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
};

export type TokenRes = {
  __typename?: 'tokenRes';
  channel?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
  uid?: Maybe<Scalars['String']>;
};

export type UnitRes = {
  __typename?: 'unitRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Unit>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type UserRes = {
  __typename?: 'userRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<User>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type VariantRes = {
  __typename?: 'variantRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Variant>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type VendorRes = {
  __typename?: 'vendorRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Vendor>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type VideoRes = {
  __typename?: 'videoRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Video>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type WishlistRes = {
  __typename?: 'wishlistRes';
  count?: Maybe<Scalars['Int']>;
  data?: Maybe<Array<Maybe<Wishlist>>>;
  page?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
};

export type RemoveStoreCountryMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type RemoveStoreCountryMutation = { __typename?: 'Mutation', removeStoreCountry?: boolean | null };

export type SaveStoreCountryMutationVariables = Exact<{
  id: Scalars['String'];
  country?: InputMaybe<Scalars['ID']>;
  default?: InputMaybe<Scalars['Boolean']>;
  active?: InputMaybe<Scalars['Boolean']>;
}>;


export type SaveStoreCountryMutation = { __typename?: 'Mutation', saveStoreCountry?: { __typename?: 'OneStoreCountry', id?: string | null, default?: boolean | null, active?: boolean | null, country?: string | null, name?: string | null, code?: string | null, user?: string | null, store?: string | null } | null };

export type StoreCountriesQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  store: Scalars['ID'];
}>;


export type StoreCountriesQuery = { __typename?: 'Query', storeCountries?: { __typename?: 'StoreCountryRes', count?: number | null, page?: number | null, pageSize?: number | null, data?: Array<{ __typename?: 'StoreCountry', id?: string | null, default?: boolean | null, active?: boolean | null, name?: string | null, code?: string | null, country?: { __typename?: 'Country', id: string, name: string, value?: string | null, dialCode?: string | null, code?: string | null, img?: string | null, imgCdn?: string | null, flag?: string | null, lang?: string | null } | null, user?: { __typename?: 'User', id?: string | null, firstName?: string | null, lastName?: string | null, email?: string | null } | null } | null> | null } | null };

export type StoreCountryQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type StoreCountryQuery = { __typename?: 'Query', storeCountry?: { __typename?: 'StoreCountry', id?: string | null, default?: boolean | null, active?: boolean | null, name?: string | null, code?: string | null, country?: { __typename?: 'Country', id: string, name: string, value?: string | null, dialCode?: string | null, code?: string | null, img?: string | null, imgCdn?: string | null, flag?: string | null, lang?: string | null } | null, user?: { __typename?: 'User', id?: string | null, firstName?: string | null, lastName?: string | null } | null } | null };

export type AddressQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type AddressQuery = { __typename?: 'Query', address?: { __typename?: 'Address', id: string, email?: string | null, firstName?: string | null, lastName?: string | null, address?: string | null, locality?: string | null, town?: string | null, city?: string | null, country?: string | null, state?: string | null, zip?: string | null, phone?: string | null, lat?: number | null, lng?: number | null, active?: boolean | null, verified?: boolean | null, createdAt: string, updatedAt: string } | null };

export type AddressesQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
}>;


export type AddressesQuery = { __typename?: 'Query', addresses?: { __typename?: 'addressRes', count?: number | null, page?: number | null, pageSize?: number | null, data?: Array<{ __typename?: 'Address', id: string, email?: string | null, firstName?: string | null, lastName?: string | null, address?: string | null, locality?: string | null, town?: string | null, city?: string | null, country?: string | null, state?: string | null, zip?: string | null, phone?: string | null, lat?: number | null, lng?: number | null, active?: boolean | null, verified?: boolean | null, createdAt: string, updatedAt: string, store?: string | null } | null> | null } | null };

export type DeleteAddressMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteAddressMutation = { __typename?: 'Mutation', deleteAddress?: boolean | null };

export type MyAddressesQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
}>;


export type MyAddressesQuery = { __typename?: 'Query', myAddresses?: { __typename?: 'addressRes', count?: number | null, page?: number | null, pageSize?: number | null, data?: Array<{ __typename?: 'Address', id: string, email?: string | null, firstName?: string | null, lastName?: string | null, address?: string | null, locality?: string | null, town?: string | null, city?: string | null, country?: string | null, state?: string | null, zip?: string | null, phone?: string | null, lat?: number | null, lng?: number | null, active?: boolean | null, verified?: boolean | null, createdAt: string, updatedAt: string } | null> | null } | null };

export type SaveAddressMutationVariables = Exact<{
  id: Scalars['String'];
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  address?: InputMaybe<Scalars['String']>;
  locality?: InputMaybe<Scalars['String']>;
  town?: InputMaybe<Scalars['String']>;
  district?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  zip?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  lat?: InputMaybe<Scalars['Float']>;
  lng?: InputMaybe<Scalars['Float']>;
  store?: InputMaybe<Scalars['ID']>;
  isResidential?: InputMaybe<Scalars['Boolean']>;
}>;


export type SaveAddressMutation = { __typename?: 'Mutation', saveAddress?: { __typename?: 'Address', id: string, firstName?: string | null, lastName?: string | null, address?: string | null, locality?: string | null, town?: string | null, district?: string | null, city?: string | null, type?: string | null, country?: string | null, state?: string | null, zip?: string | null, phone?: string | null, email?: string | null, lat?: number | null, lng?: number | null, isResidential?: boolean | null, store?: string | null } | null };

export type BlogQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type BlogQuery = { __typename?: 'Query', blog?: { __typename?: 'Blog', id: string, title?: string | null, slug?: string | null, active?: boolean | null, excerpt?: string | null, content?: string | null, published_at?: string | null, img?: string | null, imgCdn?: string | null, createdAt: string, updatedAt: string, user?: { __typename?: 'User', firstName?: string | null, lastName?: string | null, avatar?: string | null } | null, store?: { __typename?: 'Store', id: string, name?: string | null, email?: string | null, phone?: string | null } | null } | null };

export type BlogsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
}>;


export type BlogsQuery = { __typename?: 'Query', blogs?: { __typename?: 'blogRes', count?: number | null, page?: number | null, pageSize?: number | null, data?: Array<{ __typename?: 'Blog', id: string, title?: string | null, slug?: string | null, active?: boolean | null, excerpt?: string | null, content?: string | null, published_at?: string | null, img?: string | null, imgCdn?: string | null, createdAt: string, updatedAt: string, user?: { __typename?: 'User', firstName?: string | null, lastName?: string | null, avatar?: string | null } | null, store?: { __typename?: 'Store', id: string, name?: string | null, email?: string | null, phone?: string | null } | null } | null> | null } | null };

export type DeleteBlogMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteBlogMutation = { __typename?: 'Mutation', deleteBlog?: boolean | null };

export type SaveBlogMutationVariables = Exact<{
  id: Scalars['String'];
  title?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
  excerpt?: InputMaybe<Scalars['String']>;
  content?: InputMaybe<Scalars['String']>;
  published_at?: InputMaybe<Scalars['String']>;
  img?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  active?: InputMaybe<Scalars['Boolean']>;
}>;


export type SaveBlogMutation = { __typename?: 'Mutation', saveBlog?: { __typename?: 'OneBlog', id: string, title?: string | null, slug?: string | null, active?: boolean | null, excerpt?: string | null, content?: string | null, published_at?: string | null, img?: string | null, imgCdn?: string | null, tags?: Array<string | null> | null } | null };

export type AddToCartMutationVariables = Exact<{
  qty: Scalars['Int'];
  pid: Scalars['ID'];
  vid?: InputMaybe<Scalars['ID']>;
  options?: InputMaybe<Array<InputMaybe<OptionIp1>> | InputMaybe<OptionIp1>>;
  vendor?: InputMaybe<Scalars['ID']>;
  replace?: InputMaybe<Scalars['Boolean']>;
}>;


export type AddToCartMutation = { __typename?: 'Mutation', addToCart?: { __typename?: 'Cart', needAddress?: boolean | null, qty?: number | null, subtotal?: number | null, tax?: number | null, total?: number | null, items?: Array<{ __typename?: 'CartItem', pid?: string | null, vid?: string | null, barcode?: string | null, name?: string | null, type?: string | null, slug?: string | null, qty?: number | null, price?: number | null, shippingCharge?: number | null, tax?: number | null, img?: string | null, imgCdn?: string | null, brandName?: string | null, vendor?: string | null, vendorSlug?: string | null, vendorBusinessName?: string | null, deliveryDetails?: string | null, options?: Array<{ __typename?: 'Option1', option?: string | null, values?: Array<string | null> | null } | null> | null, usedOptions?: Array<{ __typename?: 'UsedOption', name?: string | null, val?: Array<string | null> | null, dates?: Array<string | null> | null } | null> | null } | null> | null, discount?: { __typename?: 'CartDiscount', code?: string | null, value?: number | null, text?: string | null, amount?: number | null } | null, shipping?: { __typename?: 'Shipping', charge?: number | null } | null } | null };

export type CartQueryVariables = Exact<{
  store?: InputMaybe<Scalars['ID']>;
}>;


export type CartQuery = { __typename?: 'Query', cart?: { __typename?: 'Cart', id?: string | null, storeCurrency?: string | null, currencyCode?: string | null, currencyName?: string | null, currencySymbol?: string | null, needAddress?: boolean | null, qty?: number | null, tax?: number | null, subtotal?: number | null, total?: number | null, items?: Array<{ __typename?: 'CartItem', pid?: string | null, barcode?: string | null, tax?: number | null, name?: string | null, type?: string | null, slug?: string | null, qty?: number | null, price?: number | null, mrp?: number | null, shippingCharge?: number | null, img?: string | null, imgCdn?: string | null, tracking?: string | null, brandName?: string | null, vendor?: string | null, vendorSlug?: string | null, vendorBusinessName?: string | null, deliveryDetails?: string | null, foodType?: string | null, usedOptions?: Array<{ __typename?: 'UsedOption', name?: string | null, val?: Array<string | null> | null, dates?: Array<string | null> | null } | null> | null, options?: Array<{ __typename?: 'Option1', option?: string | null, values?: Array<string | null> | null } | null> | null, formattedItemAmount?: { __typename?: 'CartItemAmount', mrp?: string | null, price?: string | null, tax?: string | null, shippingCharge?: string | null } | null } | null> | null, discount?: { __typename?: 'CartDiscount', code?: string | null, value?: number | null, text?: string | null, amount?: number | null } | null, shipping?: { __typename?: 'Shipping', charge?: number | null } | null, formattedAmount?: { __typename?: 'CartAmount', offer_total?: string | null, tax?: string | null, subtotal?: string | null, total?: string | null } | null, unavailableItems?: Array<{ __typename?: 'CartItem', status?: string | null, msg?: string | null, pid?: string | null, barcode?: string | null, tax?: number | null, name?: string | null, type?: string | null, slug?: string | null, qty?: number | null, price?: number | null, mrp?: number | null, shippingCharge?: number | null, img?: string | null, imgCdn?: string | null, tracking?: string | null, brandName?: string | null, vendor?: string | null, vendorSlug?: string | null, vendorBusinessName?: string | null, deliveryDetails?: string | null, foodType?: string | null, usedOptions?: Array<{ __typename?: 'UsedOption', name?: string | null, val?: Array<string | null> | null, dates?: Array<string | null> | null } | null> | null, options?: Array<{ __typename?: 'Option1', option?: string | null, values?: Array<string | null> | null } | null> | null } | null> | null } | null };

export type CheckoutMutationVariables = Exact<{
  address?: InputMaybe<Scalars['ID']>;
  slot?: InputMaybe<Scalars['ID']>;
}>;


export type CheckoutMutation = { __typename?: 'Mutation', checkout?: { __typename?: 'Order', id?: string | null, orderNo?: string | null, otp?: string | null, createdAt?: string | null, updatedAt?: string | null, paymentMode?: string | null, paymentStatus?: string | null, paymentCurrency?: string | null, paymentReferenceId?: string | null, paymentOrderId?: string | null, paymentReceipt?: string | null, invoiceId?: string | null, paymentGateway?: string | null, codPaid?: number | null, baseCodPaid?: number | null, amountPaid?: number | null, amountDue?: number | null, paymentMsg?: string | null, paymentTime?: string | null, paid?: boolean | null, userFirstName?: string | null, userLastName?: string | null, userPhone?: string | null, userEmail?: string | null, payment?: { __typename?: 'Payment', id?: string | null } | null, amount?: { __typename?: 'Amount', qty?: number | null, subtotal?: number | null, tax?: number | null, discount?: number | null, total?: number | null, shipping?: number | null } | null, baseAmount?: { __typename?: 'Amount', subtotal?: number | null, tax?: number | null, discount?: number | null, total?: number | null, shipping?: number | null } | null, store?: { __typename?: 'Store', id: string, name?: string | null } | null, address?: { __typename?: 'Address', firstName?: string | null, lastName?: string | null, town?: string | null, city?: string | null, state?: string | null, zip?: string | null, address?: string | null, lat?: number | null, lng?: number | null } | null, items?: Array<{ __typename?: 'OrderItem', pid?: string | null, status?: string | null, posInvoiceNo?: string | null, itemOrderNo?: string | null, name?: string | null, barcode?: string | null, img?: string | null, imgCdn?: string | null, slug?: string | null, price?: number | null, basePrice?: number | null, qty?: number | null, shippingCharge?: number | null, baseShippingCharge?: number | null, tax?: number | null, baseTax?: number | null, subtotal?: number | null, baseSubtotal?: number | null, total?: number | null, baseTotal?: number | null, time?: string | null, brandName?: string | null, brandImg?: string | null, brandImgCdn?: string | null, parentBrandName?: string | null, parentBrandImg?: string | null, parentBrandImgCdn?: string | null, color?: string | null, size?: string | null, vendorAddress?: { __typename?: 'Address', firstName?: string | null, lastName?: string | null, town?: string | null, city?: string | null, state?: string | null, zip?: string | null, address?: string | null, lat?: number | null, lng?: number | null } | null, vendor?: { __typename?: 'Vendor', id?: string | null, businessName?: string | null } | null }> | null, orderItems?: Array<{ __typename?: 'OrderItem', id?: string | null }> | null } | null };

export type CategoriesQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  megamenu?: InputMaybe<Scalars['Boolean']>;
  featured?: InputMaybe<Scalars['Boolean']>;
  active?: InputMaybe<Scalars['Boolean']>;
  img?: InputMaybe<Scalars['Boolean']>;
  shopbycategory?: InputMaybe<Scalars['Boolean']>;
  store?: InputMaybe<Scalars['ID']>;
}>;


export type CategoriesQuery = { __typename?: 'Query', categories?: { __typename?: 'categoryResSimple', count?: number | null, page?: number | null, pageSize?: number | null, data?: Array<{ __typename?: 'CategorySimple', id: string, name?: string | null, namePath?: string | null, categoryId?: string | null, parent?: string | null, slug?: string | null, img?: string | null, imgCdn?: string | null, banner?: string | null, bannerCdn?: string | null, level?: number | null, link?: string | null, metaTitle?: string | null, metaDescription?: string | null, metaKeywords?: string | null, keywords?: string | null, position?: number | null, megamenu?: boolean | null, active?: boolean | null, featured?: boolean | null, featuredSort?: number | null, shopbycategory?: boolean | null, createdAt?: string | null, updatedAt?: string | null, store?: string | null } | null> | null } | null };

export type CategoryQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
}>;


export type CategoryQuery = { __typename?: 'Query', category?: { __typename?: 'Category', id: string, name?: string | null, categoryId?: string | null, description?: string | null, slug?: string | null, img?: string | null, imgCdn?: string | null, banner?: string | null, bannerCdn?: string | null, level?: number | null, link?: string | null, metaTitle?: string | null, metaDescription?: string | null, metaKeywords?: string | null, keywords?: string | null, position?: number | null, megamenu?: boolean | null, active?: boolean | null, featured?: boolean | null, featuredSort?: number | null, shopbycategory?: boolean | null, createdAt?: string | null, updatedAt?: string | null, pathA?: Array<{ __typename?: 'Category', slug?: string | null, name?: string | null } | null> | null, parent?: { __typename?: 'Category', name?: string | null } | null, children?: Array<{ __typename?: 'Category', id: string, name?: string | null, img?: string | null } | null> | null, attributes?: Array<{ __typename?: 'Attribute', id: string, name?: string | null, show?: boolean | null, category?: string | null, active?: boolean | null } | null> | null, brand?: { __typename?: 'Brand', id: string, name?: string | null } | null } | null };

export type MegamenuQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']>;
  slug?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  featured?: InputMaybe<Scalars['Boolean']>;
  brand?: InputMaybe<Scalars['ID']>;
  store?: InputMaybe<Scalars['ID']>;
}>;


export type MegamenuQuery = { __typename?: 'Query', megamenu?: Array<{ __typename?: 'Category', id: string, name?: string | null, slug?: string | null, img?: string | null, imgCdn?: string | null, banner?: string | null, bannerCdn?: string | null, featured?: boolean | null, link?: string | null, children?: Array<{ __typename?: 'Category', name?: string | null, slug?: string | null, img?: string | null, featured?: boolean | null, link?: string | null, children?: Array<{ __typename?: 'Category', name?: string | null, slug?: string | null, img?: string | null, featured?: boolean | null, link?: string | null, children?: Array<{ __typename?: 'Category', name?: string | null, slug?: string | null, img?: string | null, featured?: boolean | null, link?: string | null, children?: Array<{ __typename?: 'Category', name?: string | null, slug?: string | null, img?: string | null, featured?: boolean | null, link?: string | null, children?: Array<{ __typename?: 'Category', name?: string | null, slug?: string | null, img?: string | null, featured?: boolean | null, link?: string | null, children?: Array<{ __typename?: 'Category', name?: string | null, slug?: string | null, img?: string | null, featured?: boolean | null, children?: Array<{ __typename?: 'Category', name?: string | null, slug?: string | null, img?: string | null, featured?: boolean | null, children?: Array<{ __typename?: 'Category', name?: string | null, slug?: string | null, img?: string | null, featured?: boolean | null, children?: Array<{ __typename?: 'Category', name?: string | null, slug?: string | null, img?: string | null, featured?: boolean | null } | null> | null } | null> | null } | null> | null } | null> | null } | null> | null } | null> | null } | null> | null } | null> | null } | null> | null } | null> | null };

export type CountriesQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
}>;


export type CountriesQuery = { __typename?: 'Query', countries?: { __typename?: 'countryRes', count?: number | null, page?: number | null, pageSize?: number | null, data?: Array<{ __typename?: 'Country', id: string, name: string, value?: string | null, dialCode?: string | null, code?: string | null, img?: string | null, imgCdn?: string | null, flag?: string | null, lang?: string | null, sort?: number | null, active?: boolean | null, states?: Array<{ __typename?: 'State', name: string } | null> | null } | null> | null } | null };

export type CountryQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']>;
}>;


export type CountryQuery = { __typename?: 'Query', country?: { __typename?: 'Country', id: string, name: string, value?: string | null, dialCode?: string | null, code?: string | null, img?: string | null, imgCdn?: string | null, flag?: string | null, lang?: string | null, sort?: number | null, active?: boolean | null, states?: Array<{ __typename?: 'State', name: string } | null> | null } | null };

export type DeleteCountryMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteCountryMutation = { __typename?: 'Mutation', deleteCountry?: boolean | null };

export type SaveCountryMutationVariables = Exact<{
  id?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
  dialCode?: InputMaybe<Scalars['String']>;
  code?: InputMaybe<Scalars['String']>;
  img?: InputMaybe<Scalars['String']>;
  flag?: InputMaybe<Scalars['String']>;
  lang?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['Int']>;
  active?: InputMaybe<Scalars['Boolean']>;
}>;


export type SaveCountryMutation = { __typename?: 'Mutation', saveCountry?: { __typename?: 'Country', id: string, name: string, value?: string | null, dialCode?: string | null, code?: string | null, img?: string | null, imgCdn?: string | null, flag?: string | null, lang?: string | null, sort?: number | null, active?: boolean | null, createdAt: string, updatedAt: string, states?: Array<{ __typename?: 'State', name: string } | null> | null } | null };

export type InitQueryVariables = Exact<{
  domain?: InputMaybe<Scalars['String']>;
}>;


export type InitQuery = { __typename?: 'Query', settings?: { __typename?: 'Setting', id?: string | null, websiteName?: string | null, websiteLegalName?: string | null, liveCommerce?: boolean | null, multilingual?: boolean | null, closed?: boolean | null, closedMessage?: string | null, minimumOrderValue?: number | null, title?: string | null, alert?: string | null, keywords?: string | null, description?: string | null, demo?: boolean | null, RAZORPAY_KEY_ID?: string | null, GOOGLE_CLIENT_ID?: string | null, LIVE_COMMERCE_URL?: string | null, stripePublishableKey?: string | null, brainTreePublicKey?: string | null, enableStripe?: boolean | null, enableRazorpay?: boolean | null, currencyCode?: string | null, currencySymbol?: string | null, currencyDecimals?: number | null, openGraphImage?: string | null, userRoles?: Array<string | null> | null, websiteEmail?: string | null, shopPhone?: string | null, shopAddress?: string | null, country?: string | null, currency?: string | null, logo?: string | null, logoMobile?: string | null, logoDark?: string | null, logoMobileDark?: string | null, favicon?: string | null, CDN_URL?: string | null, S3_URL?: string | null, searchbarText?: string | null, pageSize?: number | null, returnReasons?: Array<string | null> | null, paymentStatuses?: Array<string | null> | null, otpLogin?: boolean | null, ADMIN_PANEL_LINK?: string | null, DOCS_LINK?: string | null, storageProvider?: string | null, googleMapsApi?: string | null, facebook?: string | null, twitter?: string | null, google?: string | null, instagram?: string | null, linkedin?: string | null, enableTax?: boolean | null, locationExpiry?: number | null, WWW_URL?: string | null, referralBonus?: number | null, joiningBonus?: number | null, isMultiVendor?: boolean | null, isMultiStore?: boolean | null, isMegamenu?: boolean | null, isSaas?: boolean | null, isSearch?: boolean | null, tax?: { __typename?: 'Tax', cgst?: number | null, sgst?: number | null, igst?: number | null } | null, shipping?: { __typename?: 'Shipping', deliveryDays?: number | null, charge?: number | null, free?: number | null, method?: string | null, enabled?: boolean | null, provider?: string | null } | null, countryDetails?: { __typename?: 'Country', id: string, name: string, value?: string | null, dialCode?: string | null, code?: string | null, img?: string | null, imgCdn?: string | null, flag?: string | null, lang?: string | null, active?: boolean | null } | null, currencyDetails?: { __typename?: 'Currency', id?: string | null, isoCode?: string | null, name?: string | null, symbol?: string | null } | null, orderStatuses?: Array<{ __typename?: 'OrderStatus', status?: string | null, title?: string | null, body?: string | null, icon?: string | null, public?: boolean | null, index?: number | null } | null> | null, paymentMethods?: Array<{ __typename?: 'PaymentMethod', active?: boolean | null, name: string, value?: string | null, img?: string | null, color?: string | null, position?: number | null, text?: string | null } | null> | null, sms?: { __typename?: 'Sms', AUTO_VERIFICATION_ID?: string | null, enabled?: boolean | null, provider?: string | null } | null, email?: { __typename?: 'Email', enabled?: boolean | null, from?: string | null, cc?: Array<string | null> | null, bcc?: Array<string | null> | null, printers?: Array<string | null> | null } | null, storage?: { __typename?: 'Storage', enabled?: boolean | null, provider?: string | null } | null, review?: { __typename?: 'ReviewSetting', enabled?: boolean | null, moderate?: boolean | null } | null, product?: { __typename?: 'ProductSetting', moderate?: boolean | null } | null, customerOrderNotifications?: { __typename?: 'UserNotification', orderConfirmation?: boolean | null, orderStatusChanged?: boolean | null, orderShipped?: boolean | null, orderIsReadyForPickup?: boolean | null, downloadEGoods?: boolean | null, giftCardPurchased?: boolean | null } | null, adminNotifications?: { __typename?: 'AdminNotification', newOrderPlaced?: boolean | null, lowStockNotification?: boolean | null } | null, foodTypes?: Array<{ __typename?: 'NameValImg', name?: string | null, val?: string | null, img?: string | null } | null> | null } | null, storeOne?: { __typename?: 'Store', id: string, active?: boolean | null, featured?: boolean | null, address?: string | null, alert?: string | null, analyticsTrackingId?: string | null, banners?: Array<string | null> | null, closed?: boolean | null, isWishlist?: boolean | null, isCart?: boolean | null, closedMessage?: string | null, description?: string | null, metaDescription?: string | null, dimentionUnit?: string | null, domain?: string | null, email?: string | null, facebook?: string | null, facebookPixelId?: string | null, facebookUrl?: string | null, favicon?: string | null, faviconCdn?: string | null, firstName?: string | null, freeShippingOn?: number | null, gdpr?: boolean | null, gdprCookieConsent?: string | null, google?: string | null, googleAdsTag?: string | null, homeMeta1?: string | null, homeMeta2?: string | null, homeMeta3?: string | null, homeMeta4?: string | null, img?: string | null, imgCdn?: string | null, images?: Array<string | null> | null, imagesCdn?: Array<string | null> | null, bankAccountNo?: string | null, bankAccountHolderName?: string | null, bankIfscCode?: string | null, bankSwiftCode?: string | null, instagram?: string | null, instagramUrl?: string | null, isHideNilStock?: boolean | null, isMegamenu?: boolean | null, isOpen?: boolean | null, isSearch?: boolean | null, isHyperlocal?: boolean | null, isFnb?: boolean | null, keywords?: string | null, lastName?: string | null, lat?: number | null, legalName?: string | null, linkedin?: string | null, lng?: number | null, locality?: string | null, logo?: string | null, logoDark?: string | null, logoMobile?: string | null, logoMobileDark?: string | null, logoCdn?: string | null, logoDarkCdn?: string | null, logoMobileCdn?: string | null, logoMobileDarkCdn?: string | null, minimumOrderValue?: number | null, minOrderValue?: number | null, name?: string | null, openGraphImage?: string | null, openGraphImageCdn?: string | null, pageSize?: number | null, phone?: string | null, pinterestTag?: string | null, pinterestUrl?: string | null, qrCode?: string | null, searchbarText?: string | null, shippingCharge?: number | null, shopAddress?: string | null, shopPhone?: string | null, slug?: string | null, snapChatPixel?: string | null, state?: string | null, storeId?: string | null, timeZone?: string | null, timing?: string | null, title?: string | null, twitter?: string | null, twitterUrl?: string | null, websiteEmail?: string | null, websiteLegalName?: string | null, websiteName?: string | null, weightUnit?: string | null, youtubeUrl?: string | null, webmail?: string | null, zip?: string | null, timeDisplayFormat?: string | null, priceDisplayFormat?: string | null, createdAt?: string | null, updatedAt?: string | null, shippoToken?: string | null, shipRocketEmail?: string | null, shipRocketPassword?: string | null, shipRocketChannelId?: string | null, pickrrAuthToken?: string | null, adminNotifications?: { __typename?: 'AdminNotification', lowStockNotification?: boolean | null, newOrderPlaced?: boolean | null } | null, customerOrderNotifications?: { __typename?: 'UserNotification', downloadEGoods?: boolean | null, giftCardPurchased?: boolean | null, orderConfirmation?: boolean | null, orderIsReadyForPickup?: boolean | null, orderShipped?: boolean | null, orderStatusChanged?: boolean | null, orderConfirmationSms?: boolean | null } | null, vendorNotifications?: { __typename?: 'VendorNotification', orderConfirmationSms?: boolean | null } | null, review?: { __typename?: 'ReviewSetting', enabled?: boolean | null, moderate?: boolean | null } | null, shipping?: { __typename?: 'Shipping', charge?: number | null, deliveryDays?: number | null, enabled?: boolean | null, free?: number | null, method?: string | null, provider?: string | null } | null, sms?: { __typename?: 'Sms', AUTO_VERIFICATION_ID?: string | null } | null, user?: { __typename?: 'User', firstName?: string | null, lastName?: string | null, email?: string | null, phone?: string | null } | null, storeCountry?: { __typename?: 'StoreCountry', id?: string | null, default?: boolean | null, active?: boolean | null, name?: string | null, code?: string | null, country?: { __typename?: 'Country', id: string, name: string, value?: string | null, dialCode?: string | null, code?: string | null, img?: string | null, imgCdn?: string | null, flag?: string | null, lang?: string | null } | null } | null, storeCurrency?: { __typename?: 'StoreCurrency', id?: string | null, default?: boolean | null, active?: boolean | null, isoCode?: string | null, name?: string | null, symbol?: string | null, currency?: { __typename?: 'Currency', id?: string | null, name?: string | null, sort?: number | null, isoCode?: string | null, isoNumericCode?: number | null, thousandsSeparator?: string | null, decimalMark?: string | null, symbolFirst?: boolean | null, active?: boolean | null, symbol?: string | null, disambiguateSymbol?: string | null, htmlEntity?: string | null, subUnit?: string | null, smallestDenomination?: number | null, subunitToUnit?: number | null } | null } | null, storeLanguage?: { __typename?: 'StoreLanguage', id?: string | null, default?: boolean | null, active?: boolean | null, name?: string | null, code?: string | null, lang?: { __typename?: 'Language', id?: string | null, name?: string | null, nativeName?: string | null, code?: string | null, phpLocaleCode?: string | null, rtl?: boolean | null, sort?: number | null, active?: boolean | null } | null } | null } | null, megamenu?: Array<{ __typename?: 'Category', id: string, name?: string | null, slug?: string | null, img?: string | null, featured?: boolean | null, children?: Array<{ __typename?: 'Category', name?: string | null, slug?: string | null, img?: string | null, featured?: boolean | null, children?: Array<{ __typename?: 'Category', name?: string | null, slug?: string | null, img?: string | null, featured?: boolean | null, children?: Array<{ __typename?: 'Category', name?: string | null, slug?: string | null, img?: string | null, featured?: boolean | null, children?: Array<{ __typename?: 'Category', name?: string | null, slug?: string | null, img?: string | null, featured?: boolean | null, children?: Array<{ __typename?: 'Category', name?: string | null, slug?: string | null, img?: string | null, featured?: boolean | null, children?: Array<{ __typename?: 'Category', name?: string | null, slug?: string | null, img?: string | null, featured?: boolean | null, children?: Array<{ __typename?: 'Category', name?: string | null, slug?: string | null, img?: string | null, featured?: boolean | null, children?: Array<{ __typename?: 'Category', name?: string | null, slug?: string | null, img?: string | null, featured?: boolean | null, children?: Array<{ __typename?: 'Category', name?: string | null, slug?: string | null, img?: string | null, featured?: boolean | null } | null> | null } | null> | null } | null> | null } | null> | null } | null> | null } | null> | null } | null> | null } | null> | null } | null> | null } | null> | null };

export type HomeQueryVariables = Exact<{
  store?: InputMaybe<Scalars['ID']>;
  zip?: InputMaybe<Scalars['String']>;
}>;


export type HomeQuery = { __typename?: 'Query', brands?: { __typename?: 'brandRes', count?: number | null, page?: number | null, pageSize?: number | null, data?: Array<{ __typename?: 'Brand', id: string, brandId?: string | null, name?: string | null, slug?: string | null, img?: string | null, imgCdn?: string | null, position?: number | null, info?: string | null, meta?: string | null, metaTitle?: string | null, metaDescription?: string | null, metaKeywords?: string | null, facebookUrl?: string | null, instaUrl?: string | null, twitterUrl?: string | null, linkedinUrl?: string | null, youtubeUrl?: string | null, pinterestUrl?: string | null, googleUrl?: string | null, active?: boolean | null, featured?: boolean | null, createdAt: string, updatedAt: string, parent?: { __typename?: 'Brand', id: string, name?: string | null } | null, store?: { __typename?: 'Store', id: string, name?: string | null, email?: string | null, phone?: string | null, active?: boolean | null } | null } | null> | null } | null, categories?: { __typename?: 'categoryResSimple', count?: number | null, page?: number | null, pageSize?: number | null, data?: Array<{ __typename?: 'CategorySimple', id: string, name?: string | null, namePath?: string | null, categoryId?: string | null, parent?: string | null, slug?: string | null, img?: string | null, imgCdn?: string | null, link?: string | null, level?: number | null, metaTitle?: string | null, metaDescription?: string | null, metaKeywords?: string | null, position?: number | null, megamenu?: boolean | null, active?: boolean | null, featured?: boolean | null, shopbycategory?: boolean | null, createdAt?: string | null, updatedAt?: string | null, store?: string | null } | null> | null } | null, banners?: { __typename?: 'bannerRes', count?: number | null, page?: number | null, pageSize?: number | null, data?: Array<{ __typename?: 'OneBanner', id: string, link?: string | null, heading?: string | null, img?: string | null, imgCdn?: string | null, sort?: number | null, type?: string | null, pageId?: string | null, groupId?: string | null, groupTitle?: string | null, active?: boolean | null, isMobile?: boolean | null, createdAt: string, updatedAt: string, store?: string | null } | null> | null } | null, youMayLike?: Array<{ __typename?: 'Product', id?: string | null, sku?: string | null, barcode?: string | null, description?: string | null, productMasterId?: string | null, slug?: string | null, name?: string | null, type?: string | null, foodType?: string | null, price?: number | null, mrp?: number | null, stock?: number | null, tax?: number | null, img?: string | null, imgCdn?: string | null, images?: Array<string | null> | null, imagesCdn?: Array<string | null> | null, time?: string | null, active?: boolean | null, popularity?: number | null, position?: number | null, trending?: boolean | null, featured?: boolean | null, hot?: boolean | null, new?: boolean | null, sale?: boolean | null, recommended?: boolean | null, title?: string | null, metaDescription?: string | null, keywords?: string | null, ratings?: number | null, reviews?: number | null, itemId?: string | null, warranty?: string | null, discount?: number | null, ageMin?: number | null, ageMax?: number | null, ageUnit?: string | null, cgst?: number | null, sgst?: number | null, igst?: number | null, returnInfo?: string | null, keyFeatures?: Array<string | null> | null, expiryDate?: string | null, countryOfOrigin?: string | null, vendor?: { __typename?: 'Vendor', businessName?: string | null } | null, productDetails?: Array<{ __typename?: 'Feature', name?: string | null, value?: string | null } | null> | null, specifications?: Array<{ __typename?: 'Feature', name?: string | null, value?: string | null } | null> | null } | null> | null, trending?: Array<{ __typename?: 'Product', id?: string | null, sku?: string | null, barcode?: string | null, description?: string | null, productMasterId?: string | null, slug?: string | null, name?: string | null, type?: string | null, foodType?: string | null, price?: number | null, mrp?: number | null, stock?: number | null, tax?: number | null, img?: string | null, imgCdn?: string | null, images?: Array<string | null> | null, imagesCdn?: Array<string | null> | null, time?: string | null, active?: boolean | null, popularity?: number | null, position?: number | null, trending?: boolean | null, featured?: boolean | null, hot?: boolean | null, new?: boolean | null, sale?: boolean | null, recommended?: boolean | null, title?: string | null, metaDescription?: string | null, keywords?: string | null, ratings?: number | null, reviews?: number | null, itemId?: string | null, warranty?: string | null, discount?: number | null, ageMin?: number | null, ageMax?: number | null, ageUnit?: string | null, cgst?: number | null, sgst?: number | null, igst?: number | null, returnInfo?: string | null, keyFeatures?: Array<string | null> | null, expiryDate?: string | null, countryOfOrigin?: string | null, vendor?: { __typename?: 'Vendor', businessName?: string | null } | null, productDetails?: Array<{ __typename?: 'Feature', name?: string | null, value?: string | null } | null> | null, specifications?: Array<{ __typename?: 'Feature', name?: string | null, value?: string | null } | null> | null } | null> | null, popular?: { __typename?: 'SearchRes', count?: number | null, pageSize?: number | null, page?: number | null, data?: Array<{ __typename?: 'Product', id?: string | null, slug?: string | null, name?: string | null, type?: string | null, price?: number | null, mrp?: number | null, discount?: number | null, stock?: number | null, img?: string | null, imgCdn?: string | null, images?: Array<string | null> | null, imagesCdn?: Array<string | null> | null, time?: string | null, ratings?: number | null, reviews?: number | null, zips?: Array<string> | null, foodType?: string | null, expiryDate?: string | null, vendor?: { __typename?: 'Vendor', id?: string | null, slug?: string | null, businessName?: string | null, banner?: string | null, bannerCdn?: string | null } | null } | null> | null } | null, groupByBanner?: Array<{ __typename?: 'bannerGroup', _id?: { __typename?: 'bgData', title?: string | null, type?: string | null } | null, data?: Array<{ __typename?: 'OneBanner', link?: string | null, heading?: string | null, img?: string | null, imgCdn?: string | null, sort?: number | null, type?: string | null, pageId?: string | null, store?: string | null, active?: boolean | null, groupId?: string | null, groupTitle?: string | null, createdAt: string, updatedAt: string } | null> | null } | null> | null };

export type MyOrderItemsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  where?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
}>;


export type MyOrderItemsQuery = { __typename?: 'Query', myOrderItems?: { __typename?: 'orderItemRes', count?: number | null, pageSize?: number | null, page?: number | null, data?: Array<{ __typename?: 'OrderItem', id?: string | null, status?: string | null, isReplacement?: boolean | null, pid?: string | null, posInvoiceNo?: string | null, itemOrderNo?: string | null, name?: string | null, slug?: string | null, img?: string | null, imgCdn?: string | null, foodType?: string | null, tracking?: string | null, shippingCharge?: number | null, price?: number | null, qty?: number | null, tax?: number | null, brandName?: string | null, brandImg?: string | null, brandImgCdn?: string | null, size?: string | null, color?: string | null, trackingId?: string | null, returnTrackingId?: string | null, courierName?: string | null, returnCourierName?: string | null, orderNo?: string | null, otp?: string | null, createdAt?: string | null, paySuccess?: number | null, paymentMode?: string | null, paymentStatus?: string | null, paymentCurrency?: string | null, paymentReferenceId?: string | null, paymentOrderId?: string | null, paymentReceipt?: string | null, invoiceId?: string | null, paymentGateway?: string | null, codPaid?: number | null, amountPaid?: number | null, amountDue?: number | null, paymentMsg?: string | null, paymentTime?: string | null, paid?: boolean | null, userFirstName?: string | null, userLastName?: string | null, userPhone?: string | null, invoiceLink?: string | null, returnValidTill?: string | null, paymentAmount?: number | null, vendorBusinessName?: string | null, usedOptions?: Array<{ __typename?: 'UsedOption', name?: string | null, val?: Array<string | null> | null, dates?: Array<string | null> | null } | null> | null, payment?: { __typename?: 'Payment', id?: string | null, amountPaid?: number | null, amountDue?: number | null } | null, vendor?: { __typename?: 'Vendor', id?: string | null, slug?: string | null, businessName?: string | null, banner?: string | null, bannerCdn?: string | null } | null, user?: { __typename?: 'User', firstName?: string | null, lastName?: string | null, email?: string | null, phone?: string | null, role?: string | null } | null, address?: { __typename?: 'Address', firstName?: string | null, lastName?: string | null, address?: string | null, lat?: number | null, lng?: number | null } | null, amount?: { __typename?: 'Amount', qty?: number | null, subtotal?: number | null, tax?: number | null, discount?: number | null, total?: number | null, shipping?: number | null } | null, store?: { __typename?: 'Store', id: string, name?: string | null, email?: string | null } | null, orderHistory?: Array<{ __typename?: 'OrderHistory', id?: string | null, status?: string | null, title?: string | null, body?: string | null, icon?: string | null, public?: boolean | null, index?: number | null, time?: string | null } | null> | null } | null> | null } | null };

export type MyOrdersQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  where?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
}>;


export type MyOrdersQuery = { __typename?: 'Query', myOrders?: { __typename?: 'orderRes', count?: number | null, pageSize?: number | null, page?: number | null, data?: Array<{ __typename?: 'Order', id?: string | null, paySuccess?: number | null, orderNo?: string | null, otp?: string | null, createdAt?: string | null, updatedAt?: string | null, codPaid?: number | null, paymentMode?: string | null, paymentStatus?: string | null, paymentCurrency?: string | null, paymentReferenceId?: string | null, paymentOrderId?: string | null, paymentReceipt?: string | null, invoiceId?: string | null, paymentGateway?: string | null, amountPaid?: number | null, amountDue?: number | null, paymentMsg?: string | null, paymentTime?: string | null, paid?: boolean | null, userFirstName?: string | null, userLastName?: string | null, userPhone?: string | null, userEmail?: string | null, payment?: { __typename?: 'Payment', id?: string | null, amountPaid?: number | null } | null, amount?: { __typename?: 'Amount', qty?: number | null, subtotal?: number | null, tax?: number | null, discount?: number | null, total?: number | null, shipping?: number | null } | null, address?: { __typename?: 'Address', firstName?: string | null, lastName?: string | null, town?: string | null, city?: string | null, state?: string | null, zip?: string | null, address?: string | null, lat?: number | null, lng?: number | null } | null, store?: { __typename?: 'Store', id: string, name?: string | null, email?: string | null } | null, items?: Array<{ __typename?: 'OrderItem', id?: string | null, pid?: string | null, status?: string | null, posInvoiceNo?: string | null, itemOrderNo?: string | null, name?: string | null, barcode?: string | null, img?: string | null, imgCdn?: string | null, foodType?: string | null, slug?: string | null, price?: number | null, qty?: number | null, shippingCharge?: number | null, subtotal?: number | null, total?: number | null, tax?: number | null, time?: string | null, brandName?: string | null, brandImg?: string | null, brandImgCdn?: string | null, vendorBusinessName?: string | null, vendor?: { __typename?: 'Vendor', id?: string | null, slug?: string | null, businessName?: string | null, banner?: string | null, bannerCdn?: string | null } | null, orderStatus?: Array<{ __typename?: 'OrderStatusRes', id: string, event?: string | null, tracking_id?: string | null, courier_name?: string | null } | null> | null }> | null, orderItems?: Array<{ __typename?: 'OrderItem', id?: string | null, status?: string | null, pid?: string | null, posInvoiceNo?: string | null, itemOrderNo?: string | null, name?: string | null, slug?: string | null, img?: string | null, imgCdn?: string | null, qty?: number | null, price?: number | null, mrp?: number | null, color?: string | null, size?: string | null, tracking?: string | null, shippingCharge?: number | null, tax?: number | null, subtotal?: number | null, total?: number | null, brandName?: string | null, brandImg?: string | null, brandImgCdn?: string | null, foodType?: string | null, usedOptions?: Array<{ __typename?: 'UsedOption', name?: string | null, val?: Array<string | null> | null, dates?: Array<string | null> | null } | null> | null }> | null } | null> | null } | null };

export type OrderItemQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OrderItemQuery = { __typename?: 'Query', orderItem?: { __typename?: 'OrderItem', id?: string | null, orderId?: string | null, status?: string | null, pid?: string | null, posInvoiceNo?: string | null, invoiceId?: string | null, itemOrderNo?: string | null, expectedDeliveryDate?: string | null, deliveryDetails?: string | null, shippingOrderId?: string | null, shippingProvider?: string | null, shippingLabelId?: string | null, shippingRateId?: string | null, shippingTrackingNumber?: string | null, shippingTrackingStatus?: string | null, shippingTrackingUrlProvider?: string | null, shippingLabelUrl?: string | null, shippingCommercialInvoiceUrl?: string | null, name?: string | null, slug?: string | null, img?: string | null, imgCdn?: string | null, tracking?: string | null, foodType?: string | null, shippingCharge?: number | null, price?: number | null, basePrice?: number | null, qty?: number | null, tax?: number | null, baseTax?: number | null, total?: number | null, totalDiscount?: number | null, subtotal?: number | null, brandName?: string | null, brandImg?: string | null, brandImgCdn?: string | null, size?: string | null, color?: string | null, trackingId?: string | null, returnTrackingId?: string | null, courierName?: string | null, returnCourierName?: string | null, replaceValidTill?: string | null, returnValidTill?: string | null, returnPolicyExpired?: boolean | null, returnReason?: string | null, type?: string | null, amountRefunded?: number | null, baseAmountRefunded?: number | null, orderNo?: string | null, otp?: string | null, createdAt?: string | null, paySuccess?: number | null, paymentMode?: string | null, paymentStatus?: string | null, paymentCurrency?: string | null, paymentReferenceId?: string | null, paymentOrderId?: string | null, paymentReceipt?: string | null, paymentGateway?: string | null, codPaid?: number | null, baseCodPaid?: number | null, amountPaid?: number | null, amountDue?: number | null, totalAmountRefunded?: number | null, baseTotalAmountRefunded?: number | null, paymentMsg?: string | null, paymentTime?: string | null, paid?: boolean | null, userFirstName?: string | null, userLastName?: string | null, userPhone?: string | null, userEmail?: string | null, invoiceLink?: string | null, discount?: number | null, baseDiscount?: number | null, baseTotalDiscount?: number | null, weight?: number | null, unit?: string | null, vendorBusinessName?: string | null, vendorPhone?: string | null, vendorEmail?: string | null, vendorCommissionType?: string | null, vendorCommissionValue?: number | null, formattedSubtotal?: string | null, formattedShippingCharge?: string | null, formattedMrp?: string | null, formattedAmountRefunded?: string | null, formattedPrice?: string | null, formattedTax?: string | null, formattedTotal?: string | null, formattedTotalDiscount?: string | null, formattedVendorCommission?: string | null, formattedAmountDue?: string | null, formattedAmountPaid?: string | null, formattedCodPaid?: string | null, formattedDiscount?: string | null, formattedPaymentAmount?: string | null, formattedTotalAmountRefunded?: string | null, usedOptions?: Array<{ __typename?: 'UsedOption', name?: string | null, val?: Array<string | null> | null, dates?: Array<string | null> | null } | null> | null, refunds?: Array<{ __typename?: 'Refund', message?: string | null, qty?: number | null, time?: string | null, amount?: number | null, refundId?: string | null } | null> | null, payment?: { __typename?: 'Payment', id?: string | null } | null, amount?: { __typename?: 'Amount', total?: number | null, discount?: number | null, totalDiscount?: number | null, subtotal?: number | null } | null, baseAmount?: { __typename?: 'Amount', total?: number | null, discount?: number | null, totalDiscount?: number | null, subtotal?: number | null } | null, user?: { __typename?: 'User', id?: string | null, firstName?: string | null } | null, address?: { __typename?: 'Address', firstName?: string | null, lastName?: string | null, town?: string | null, city?: string | null, state?: string | null, zip?: string | null, address?: string | null, lat?: number | null, lng?: number | null } | null, store?: { __typename?: 'Store', id: string, name?: string | null, email?: string | null } | null, slot?: { __typename?: 'Slot', name?: string | null, value?: string | null, info?: string | null, active?: boolean | null } | null, vendor?: { __typename?: 'Vendor', id?: string | null, slug?: string | null, businessName?: string | null, banner?: string | null, bannerCdn?: string | null } | null, vendorAddress?: { __typename?: 'Address', firstName?: string | null, lastName?: string | null, town?: string | null, city?: string | null, state?: string | null, zip?: string | null, address?: string | null, lat?: number | null, lng?: number | null } | null, formattedAmount?: { __typename?: 'OrderItemAmount', subtotal?: string | null, tax?: string | null, discount?: string | null, shipping?: string | null, total?: string | null, totalDiscount?: string | null, exchangeRate?: string | null } | null, orderHistory?: Array<{ __typename?: 'OrderHistory', id?: string | null, status?: string | null, title?: string | null, body?: string | null, icon?: string | null, public?: boolean | null, index?: number | null, time?: string | null } | null> | null } | null };

export type PaySuccessPageHitMutationVariables = Exact<{
  orderId?: InputMaybe<Scalars['ID']>;
  paymentReferenceId?: InputMaybe<Scalars['String']>;
}>;


export type PaySuccessPageHitMutation = { __typename?: 'Mutation', paySuccessPageHit?: { __typename?: 'Order', id?: string | null, orderNo?: string | null, otp?: string | null, createdAt?: string | null, paySuccess?: number | null, paymentMode?: string | null, paymentStatus?: string | null, paymentCurrency?: string | null, paymentReferenceId?: string | null, paymentOrderId?: string | null, paymentReceipt?: string | null, invoiceId?: string | null, paymentGateway?: string | null, codPaid?: number | null, baseCodPaid?: number | null, amountPaid?: number | null, amountDue?: number | null, paymentMsg?: string | null, paymentTime?: string | null, paid?: boolean | null, totalAmountRefunded?: number | null, baseTotalAmountRefunded?: number | null, userFirstName?: string | null, userLastName?: string | null, userPhone?: string | null, userEmail?: string | null, amount?: { __typename?: 'Amount', qty?: number | null, subtotal?: number | null, tax?: number | null, discount?: number | null, total?: number | null, shipping?: number | null } | null, baseAmount?: { __typename?: 'Amount', qty?: number | null, subtotal?: number | null, tax?: number | null, discount?: number | null, total?: number | null, shipping?: number | null } | null, address?: { __typename?: 'Address', firstName?: string | null, lastName?: string | null, town?: string | null, city?: string | null, state?: string | null, zip?: string | null, address?: string | null, lat?: number | null, lng?: number | null } | null, items?: Array<{ __typename?: 'OrderItem', id?: string | null, pid?: string | null, posInvoiceNo?: string | null, itemOrderNo?: string | null, name?: string | null, barcode?: string | null, img?: string | null, imgCdn?: string | null, slug?: string | null, foodType?: string | null, price?: number | null, basePrice?: number | null, qty?: number | null, shippingCharge?: number | null, baseShippingCharge?: number | null, tax?: number | null, baseTax?: number | null, time?: string | null, brandName?: string | null, brandImg?: string | null, color?: string | null, size?: string | null, status?: string | null, type?: string | null, returnReason?: string | null, amountRefunded?: number | null, baseAmountRefunded?: number | null, vendorBusinessName?: string | null, usedOptions?: Array<{ __typename?: 'UsedOption', name?: string | null, val?: Array<string | null> | null, dates?: Array<string | null> | null } | null> | null, vendorAddress?: { __typename?: 'Address', firstName?: string | null, lastName?: string | null, town?: string | null, city?: string | null, state?: string | null, zip?: string | null, address?: string | null, lat?: number | null, lng?: number | null } | null, orderHistory?: Array<{ __typename?: 'OrderHistory', status?: string | null, title?: string | null, body?: string | null, icon?: string | null, public?: boolean | null, index?: number | null, time?: string | null } | null> | null }> | null } | null };

export type CashfreePayNowNewMutationVariables = Exact<{
  address?: InputMaybe<Scalars['ID']>;
  slot?: InputMaybe<Scalars['ID']>;
}>;


export type CashfreePayNowNewMutation = { __typename?: 'Mutation', cashfreePayNowNew?: { __typename?: 'Payment', orderId?: string | null, token?: string | null, redirectUrl?: string | null } | null };

export type DeletePaymentMethodMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeletePaymentMethodMutation = { __typename?: 'Mutation', deletePaymentMethod?: boolean | null };

export type PaymentMethodQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type PaymentMethodQuery = { __typename?: 'Query', paymentMethod?: { __typename?: 'PaymentMethod', id: string, name: string, img?: string | null, imgCdn?: string | null, value?: string | null, color?: string | null, key?: string | null, text?: string | null, qrcode?: string | null, type?: string | null, instructions?: string | null, position?: number | null, active?: boolean | null, isError?: boolean | null } | null };

export type PaymentMethodsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
  active?: InputMaybe<Scalars['Boolean']>;
}>;


export type PaymentMethodsQuery = { __typename?: 'Query', paymentMethods?: { __typename?: 'PayMethodRes', count?: number | null, page?: number | null, pageSize?: number | null, data?: Array<{ __typename?: 'PaymentMethod', id: string, name: string, img?: string | null, imgCdn?: string | null, value?: string | null, color?: string | null, key?: string | null, text?: string | null, qrcode?: string | null, type?: string | null, instructions?: string | null, position?: number | null, active?: boolean | null } | null> | null } | null };

export type PaymentMethodsAdminQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  active?: InputMaybe<Scalars['Boolean']>;
  store?: InputMaybe<Scalars['ID']>;
}>;


export type PaymentMethodsAdminQuery = { __typename?: 'Query', paymentMethodsAdmin?: { __typename?: 'PayMethodRes', count?: number | null, page?: number | null, pageSize?: number | null, data?: Array<{ __typename?: 'PaymentMethod', id: string, name: string, img?: string | null, imgCdn?: string | null, value?: string | null, color?: string | null, key?: string | null, text?: string | null, qrcode?: string | null, type?: string | null, instructions?: string | null, position?: number | null, active?: boolean | null, isError?: boolean | null } | null> | null } | null };

export type SavePaymentMethodMutationVariables = Exact<{
  id: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
  key?: InputMaybe<Scalars['String']>;
  color?: InputMaybe<Scalars['String']>;
  img?: InputMaybe<Scalars['String']>;
  qrcode?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  text?: InputMaybe<Scalars['String']>;
  instructions?: InputMaybe<Scalars['String']>;
  position?: InputMaybe<Scalars['Int']>;
  active?: InputMaybe<Scalars['Boolean']>;
}>;


export type SavePaymentMethodMutation = { __typename?: 'Mutation', savePaymentMethod?: { __typename?: 'PaymentMethod', id: string, name: string, key?: string | null, color?: string | null, img?: string | null, qrcode?: string | null, type?: string | null, imgCdn?: string | null, text?: string | null, instructions?: string | null, value?: string | null, position?: number | null, active?: boolean | null } | null };

export type StripeMutationVariables = Exact<{
  address?: InputMaybe<Scalars['ID']>;
  paymentMethodId?: InputMaybe<Scalars['String']>;
  slot?: InputMaybe<Scalars['ID']>;
}>;


export type StripeMutation = { __typename?: 'Mutation', stripe?: { __typename?: 'OnePayment', id?: string | null, paymentOrderId?: string | null, paymentMode?: string | null, paymentGateway?: string | null, referenceId?: string | null, txMsg?: string | null, txTime?: string | null, invoiceId?: string | null, receipt?: string | null, paid?: boolean | null, amountPaid?: number | null, amountDue?: number | null, amountRefunded?: number | null, currency?: string | null, captured?: boolean | null, status?: string | null, orderId?: string | null, notes?: string | null, refundStatus?: string | null, description?: string | null, email?: string | null, contact?: string | null, fee?: number | null, tax?: number | null, errorCode?: string | null, errorDescription?: string | null, token?: string | null, clientSecret?: string | null, approvalUrl?: string | null } | null };

export type ProductQueryVariables = Exact<{
  id: Scalars['ID'];
  zip?: InputMaybe<Scalars['String']>;
  optionValues?: InputMaybe<Array<InputMaybe<Scalars['ID']>> | InputMaybe<Scalars['ID']>>;
}>;


export type ProductQuery = { __typename?: 'Query', product?: { __typename?: 'Product', id?: string | null, slug?: string | null, name?: string | null, description?: string | null, type?: string | null, price?: number | null, mrp?: number | null, discount?: number | null, stock?: number | null, trackInventory?: boolean | null, tax?: number | null, img?: string | null, imgCdn?: string | null, images?: Array<string | null> | null, imagesCdn?: Array<string | null> | null, time?: string | null, active?: boolean | null, popularity?: number | null, position?: number | null, ratings?: number | null, reviews?: number | null, sku?: string | null, hsn?: string | null, group?: string | null, barcode?: string | null, gender?: string | null, gtin?: string | null, condition?: string | null, trending?: boolean | null, featured?: boolean | null, hot?: boolean | null, new?: boolean | null, sale?: boolean | null, recommended?: boolean | null, title?: string | null, itemId?: string | null, warranty?: string | null, metaDescription?: string | null, keywords?: string | null, keywordsA?: Array<string | null> | null, ageMin?: number | null, ageMax?: number | null, ageUnit?: string | null, styleCode?: string | null, eanNo?: string | null, articleCode?: string | null, productMasterId?: string | null, currency?: string | null, manufacturer?: string | null, countryOfOrigin?: string | null, returnInfo?: string | null, link?: string | null, cgst?: number | null, sgst?: number | null, igst?: number | null, sizechart?: string | null, batchNo?: string | null, mfgDate?: string | null, expired?: boolean | null, expiryDate?: string | null, isSearchable?: boolean | null, isUnlimited?: boolean | null, totalSold?: number | null, preOrder?: boolean | null, zips?: Array<string> | null, foodType?: string | null, deliveryDetails?: string | null, keyFeatures?: Array<string | null> | null, returnAllowed?: boolean | null, replaceAllowed?: boolean | null, returnValidityInDays?: number | null, replaceValidityInDays?: number | null, files?: Array<string | null> | null, unit?: string | null, dimensionUnit?: string | null, formattedMrp?: string | null, formattedPrice?: string | null, createdAt: string, updatedAt: string, slots?: Array<{ __typename?: 'Slot', id?: string | null, name?: string | null, value?: string | null } | null> | null, country?: { __typename?: 'Country', id: string, name: string } | null, sizeGroup?: Array<{ __typename?: 'Product', _id?: string | null, slug?: string | null, size?: { __typename?: 'Size', name?: string | null } | null } | null> | null, colorGroup?: Array<{ __typename?: 'Product', _id?: string | null, slug?: string | null, color?: { __typename?: 'Color', name?: string | null, color_code?: string | null } | null } | null> | null, brand?: { __typename?: 'Brand', id: string, name?: string | null } | null, parentBrand?: { __typename?: 'Brand', id: string, name?: string | null } | null, color?: { __typename?: 'Color', id: string, name?: string | null } | null, size?: { __typename?: 'Size', id: string, name?: string | null } | null, category?: { __typename?: 'Category', id: string, name?: string | null, slug?: string | null, pathA?: Array<{ __typename?: 'Category', name?: string | null, slug?: string | null } | null> | null } | null, categories?: Array<{ __typename?: 'Category', id: string, name?: string | null }> | null, categoryPool?: Array<{ __typename?: 'Category', id: string, name?: string | null }> | null, features?: Array<{ __typename?: 'Feature', id: string, name?: string | null, value?: string | null } | null> | null, specifications?: Array<{ __typename?: 'Feature', id: string, name?: string | null, value?: string | null } | null> | null, productDetails?: Array<{ __typename?: 'Feature', id: string, name?: string | null, value?: string | null } | null> | null, channels?: Array<{ __typename?: 'Channel', id: string, title?: string | null, img?: string | null, scheduleDateTime?: number | null, user?: { __typename?: 'User', firstName?: string | null, lastName?: string | null } | null } | null> | null, collections?: Array<{ __typename?: 'Collection', id: string, name?: string | null, description?: string | null, active?: boolean | null, images?: Array<string | null> | null, img?: string | null, q?: string | null, sort?: string | null, type?: string | null } | null> | null, options?: Array<{ __typename?: 'Option', id?: string | null, name?: string | null, inputType?: string | null, required?: boolean | null, preselectDefault?: boolean | null, position?: number | null, values?: Array<{ __typename?: 'OptionValue', id: string, name?: string | null, default?: boolean | null, position?: number | null, direction?: string | null, isPercent?: boolean | null, value?: number | null } | null> | null } | null> | null, vendor?: { __typename?: 'Vendor', id?: string | null, slug?: string | null, businessName?: string | null, banner?: string | null, bannerCdn?: string | null, ratings?: number | null, reviews?: number | null, info?: { __typename?: 'Info', store?: string | null, public?: boolean | null, storePhotos?: Array<string | null> | null } | null } | null, relatedProducts?: Array<{ __typename?: 'Product', id?: string | null, name?: string | null, slug?: string | null, img?: string | null } | null> | null } | null };

export type ProductSlugQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type ProductSlugQuery = { __typename?: 'Query', productSlug?: { __typename?: 'Product', id?: string | null, name?: string | null, description?: string | null, metaDescription?: string | null, createdAt: string, updatedAt: string, sku?: string | null, hsn?: string | null, popularity?: number | null, slug?: string | null, img?: string | null, imgCdn?: string | null, images?: Array<string | null> | null, imagesCdn?: Array<string | null> | null, price?: number | null, mrp?: number | null, formattedPrice?: string | null, formattedMrp?: string | null, stock?: number | null, isUnlimited?: boolean | null, trackInventory?: boolean | null, ratings?: number | null, reviews?: number | null, returnInfo?: string | null, replaceValidityInDays?: number | null, returnAllowed?: boolean | null, replaceAllowed?: boolean | null, color?: { __typename?: 'Color', id: string, name?: string | null } | null, size?: { __typename?: 'Size', name?: string | null } | null, brand?: { __typename?: 'Brand', name?: string | null } | null, vendor?: { __typename?: 'Vendor', id?: string | null, slug?: string | null, businessName?: string | null, banner?: string | null, bannerCdn?: string | null, ratings?: number | null, reviews?: number | null, info?: { __typename?: 'Info', store?: string | null, public?: boolean | null, storePhotos?: Array<string | null> | null } | null } | null } | null };

export type ProductsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sku?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  brand?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  vendor?: InputMaybe<Scalars['String']>;
  category?: InputMaybe<Scalars['String']>;
  active?: InputMaybe<Scalars['Boolean']>;
  featured?: InputMaybe<Scalars['Boolean']>;
  new?: InputMaybe<Scalars['Boolean']>;
  hot?: InputMaybe<Scalars['Boolean']>;
  sale?: InputMaybe<Scalars['Boolean']>;
  where?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
  types?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
}>;


export type ProductsQuery = { __typename?: 'Query', products?: { __typename?: 'SearchRes', count?: number | null, pageSize?: number | null, noOfPage?: number | null, page?: number | null, data?: Array<{ __typename?: 'Product', id?: string | null, sku?: string | null, barcode?: string | null, productMasterId?: string | null, slug?: string | null, name?: string | null, description?: string | null, type?: string | null, price?: number | null, mrp?: number | null, stock?: number | null, trackInventory?: boolean | null, tax?: number | null, img?: string | null, imgCdn?: string | null, images?: Array<string | null> | null, imagesCdn?: Array<string | null> | null, time?: string | null, active?: boolean | null, popularity?: number | null, position?: number | null, trending?: boolean | null, featured?: boolean | null, hot?: boolean | null, new?: boolean | null, sale?: boolean | null, recommended?: boolean | null, title?: string | null, metaDescription?: string | null, keywords?: string | null, keywordsA?: Array<string | null> | null, ratings?: number | null, reviews?: number | null, itemId?: string | null, warranty?: string | null, ageMin?: number | null, ageMax?: number | null, ageUnit?: string | null, cgst?: number | null, sgst?: number | null, igst?: number | null, returnInfo?: string | null, returnAllowed?: boolean | null, replaceAllowed?: boolean | null, returnValidityInDays?: number | null, sizechart?: string | null, batchNo?: string | null, mfgDate?: string | null, expired?: boolean | null, expiryDate?: string | null, isSearchable?: boolean | null, isUnlimited?: boolean | null, totalSold?: number | null, preOrder?: boolean | null, zips?: Array<string> | null, foodType?: string | null, deliveryDetails?: string | null, formattedMrp?: string | null, formattedPrice?: string | null, slots?: Array<{ __typename?: 'Slot', id?: string | null, name?: string | null, value?: string | null } | null> | null, store?: { __typename?: 'Store', id: string, name?: string | null, email?: string | null } | null, category?: { __typename?: 'Category', name?: string | null } | null, vendor?: { __typename?: 'Vendor', id?: string | null, slug?: string | null, businessName?: string | null, banner?: string | null, bannerCdn?: string | null, ratings?: number | null, reviews?: number | null, info?: { __typename?: 'Info', store?: string | null, public?: boolean | null, storePhotos?: Array<string | null> | null } | null } | null } | null> | null } | null };

export type ProductReviewsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  pid: Scalars['ID'];
  active?: InputMaybe<Scalars['Boolean']>;
}>;


export type ProductReviewsQuery = { __typename?: 'Query', productReviews?: { __typename?: 'ReviewRes', count?: number | null, page?: number | null, pageSize?: number | null, data?: Array<{ __typename?: 'Review', id: string, rating?: number | null, message?: string | null, active?: boolean | null, user?: { __typename?: 'User', firstName?: string | null, lastName?: string | null, avatar?: string | null } | null } | null> | null } | null };

export type ReviewsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
}>;


export type ReviewsQuery = { __typename?: 'Query', reviews?: { __typename?: 'ReviewRes', count?: number | null, page?: number | null, pageSize?: number | null, data?: Array<{ __typename?: 'Review', id: string, rating?: number | null, message?: string | null, active?: boolean | null, createdAt: string, updatedAt: string, pid?: { __typename?: 'Product', name?: string | null, slug?: string | null, img?: string | null, imgCdn?: string | null, type?: string | null } | null, user?: { __typename?: 'User', firstName?: string | null, lastName?: string | null, phone?: string | null } | null, vendor?: { __typename?: 'Vendor', id?: string | null, slug?: string | null, businessName?: string | null, banner?: string | null, bannerCdn?: string | null } | null, store?: { __typename?: 'Store', id: string, name?: string | null, email?: string | null } | null } | null> | null } | null };

export type PopularSearchesQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
  domain?: InputMaybe<Scalars['String']>;
}>;


export type PopularSearchesQuery = { __typename?: 'Query', popularSearches?: { __typename?: 'PopularSearchRes', count?: number | null, page?: number | null, pageSize?: number | null, data?: Array<{ __typename?: 'PopularSearch', id: string, text?: string | null, popularity?: string | null, store?: { __typename?: 'Store', id: string, name?: string | null, email?: string | null, phone?: string | null } | null } | null> | null } | null };

export type SettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type SettingsQuery = { __typename?: 'Query', settings?: { __typename?: 'Setting', id?: string | null, websiteName?: string | null, websiteLegalName?: string | null, liveCommerce?: boolean | null, multilingual?: boolean | null, closed?: boolean | null, closedMessage?: string | null, minimumOrderValue?: number | null, title?: string | null, alert?: string | null, keywords?: string | null, description?: string | null, demo?: boolean | null, RAZORPAY_KEY_ID?: string | null, GOOGLE_CLIENT_ID?: string | null, stripePublishableKey?: string | null, brainTreePublicKey?: string | null, enableStripe?: boolean | null, enableSubsription?: boolean | null, enableRazorpay?: boolean | null, currencyCode?: string | null, currencySymbol?: string | null, currencyDecimals?: number | null, openGraphImage?: string | null, userRoles?: Array<string | null> | null, websiteEmail?: string | null, shopPhone?: string | null, shopAddress?: string | null, country?: string | null, currency?: string | null, lang?: string | null, logo?: string | null, logoMobile?: string | null, logoDark?: string | null, logoMobileDark?: string | null, favicon?: string | null, CDN_URL?: string | null, S3_URL?: string | null, LIVE_COMMERCE_URL?: string | null, searchbarText?: string | null, pageSize?: number | null, returnReasons?: Array<string | null> | null, paymentStatuses?: Array<string | null> | null, otpLogin?: boolean | null, ADMIN_PANEL_LINK?: string | null, DOCS_LINK?: string | null, storageProvider?: string | null, googleMapsApi?: string | null, facebook?: string | null, twitter?: string | null, google?: string | null, instagram?: string | null, linkedin?: string | null, enableTax?: boolean | null, locationExpiry?: number | null, WWW_URL?: string | null, referralBonus?: number | null, joiningBonus?: number | null, isMultiVendor?: boolean | null, isMultiStore?: boolean | null, isMegamenu?: boolean | null, isSaas?: boolean | null, isSearch?: boolean | null, tax?: { __typename?: 'Tax', cgst?: number | null, sgst?: number | null, igst?: number | null } | null, shipping?: { __typename?: 'Shipping', deliveryDays?: number | null, charge?: number | null, free?: number | null, method?: string | null, enabled?: boolean | null, provider?: string | null } | null, countryDetails?: { __typename?: 'Country', id: string, name: string, value?: string | null, dialCode?: string | null, code?: string | null, img?: string | null, imgCdn?: string | null, flag?: string | null, lang?: string | null, active?: boolean | null } | null, currencyDetails?: { __typename?: 'Currency', id?: string | null, isoCode?: string | null, name?: string | null, symbol?: string | null } | null, langDetails?: { __typename?: 'Language', id?: string | null, name?: string | null, nativeName?: string | null, code?: string | null } | null, orderStatuses?: Array<{ __typename?: 'OrderStatus', status?: string | null, title?: string | null, body?: string | null, icon?: string | null, public?: boolean | null, index?: number | null } | null> | null, paymentMethods?: Array<{ __typename?: 'PaymentMethod', active?: boolean | null, name: string, value?: string | null, img?: string | null, color?: string | null, position?: number | null, text?: string | null } | null> | null, sms?: { __typename?: 'Sms', AUTO_VERIFICATION_ID?: string | null, enabled?: boolean | null, provider?: string | null } | null, email?: { __typename?: 'Email', enabled?: boolean | null, from?: string | null, cc?: Array<string | null> | null, bcc?: Array<string | null> | null, printers?: Array<string | null> | null } | null, storage?: { __typename?: 'Storage', enabled?: boolean | null, provider?: string | null } | null, review?: { __typename?: 'ReviewSetting', enabled?: boolean | null, moderate?: boolean | null } | null, product?: { __typename?: 'ProductSetting', moderate?: boolean | null } | null, customerOrderNotifications?: { __typename?: 'UserNotification', orderConfirmation?: boolean | null, orderStatusChanged?: boolean | null, orderShipped?: boolean | null, orderIsReadyForPickup?: boolean | null, downloadEGoods?: boolean | null, giftCardPurchased?: boolean | null } | null, adminNotifications?: { __typename?: 'AdminNotification', newOrderPlaced?: boolean | null, lowStockNotification?: boolean | null } | null, foodTypes?: Array<{ __typename?: 'NameValImg', name?: string | null, val?: string | null, img?: string | null } | null> | null } | null };

export type StatesQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['ID']>;
  countryCode?: InputMaybe<Scalars['String']>;
}>;


export type StatesQuery = { __typename?: 'Query', states?: { __typename?: 'stateRes', count?: number | null, page?: number | null, pageSize?: number | null, data?: Array<{ __typename?: 'State', id: string, name: string, value?: string | null, code?: string | null, img?: string | null, imgCdn?: string | null, flag?: string | null, lang?: string | null, sort?: number | null, active?: boolean | null, createdAt: string, updatedAt: string } | null> | null } | null };

export type StoreQueryVariables = Exact<{ [key: string]: never; }>;


export type StoreQuery = { __typename?: 'Query', store?: { __typename?: 'OneStore', id: string, active?: boolean | null, address?: string | null, alert?: string | null, analyticsTrackingId?: string | null, banners?: Array<string | null> | null, city?: string | null, closed?: boolean | null, closedMessage?: string | null, description?: string | null, metaDescription?: string | null, dimentionUnit?: string | null, domain?: string | null, email?: string | null, facebook?: string | null, facebookPixelId?: string | null, facebookUrl?: string | null, favicon?: string | null, faviconCdn?: string | null, firstName?: string | null, freeShippingOn?: number | null, gdpr?: boolean | null, gdprCookieConsent?: string | null, google?: string | null, googleAdsTag?: string | null, homeMeta1?: string | null, homeMeta2?: string | null, homeMeta3?: string | null, homeMeta4?: string | null, img?: string | null, imgCdn?: string | null, images?: Array<string | null> | null, imagesCdn?: Array<string | null> | null, instagram?: string | null, instagramUrl?: string | null, isHideNilStock?: boolean | null, isMegamenu?: boolean | null, isOpen?: boolean | null, isSearch?: boolean | null, isHyperlocal?: boolean | null, isFnb?: boolean | null, isWishlist?: boolean | null, isCart?: boolean | null, keywords?: string | null, lastName?: string | null, lat?: number | null, legalName?: string | null, linkedin?: string | null, lng?: number | null, locality?: string | null, logo?: string | null, logoDark?: string | null, logoMobile?: string | null, logoMobileDark?: string | null, logoCdn?: string | null, logoDarkCdn?: string | null, logoMobileCdn?: string | null, logoMobileDarkCdn?: string | null, minimumOrderValue?: number | null, name?: string | null, openGraphImage?: string | null, openGraphImageCdn?: string | null, pageSize?: number | null, phone?: string | null, pinterestTag?: string | null, pinterestUrl?: string | null, qrCode?: string | null, searchbarText?: string | null, shippingCharge?: number | null, shopAddress?: string | null, shopPhone?: string | null, slug?: string | null, snapChatPixel?: string | null, state?: string | null, storeId?: string | null, bankAccountNo?: string | null, bankAccountHolderName?: string | null, bankIfscCode?: string | null, bankSwiftCode?: string | null, timeZone?: string | null, timing?: string | null, title?: string | null, twitter?: string | null, twitterUrl?: string | null, websiteEmail?: string | null, websiteLegalName?: string | null, websiteName?: string | null, weightUnit?: string | null, youtubeUrl?: string | null, webmail?: string | null, zip?: string | null, timeDisplayFormat?: string | null, priceDisplayFormat?: string | null, createdAt?: string | null, updatedAt?: string | null, user?: string | null, shippoToken?: string | null, shipRocketEmail?: string | null, shipRocketPassword?: string | null, shipRocketChannelId?: string | null, pickrrAuthToken?: string | null, adminNotifications?: { __typename?: 'AdminNotification', lowStockNotification?: boolean | null, newOrderPlaced?: boolean | null } | null, customerOrderNotifications?: { __typename?: 'UserNotification', downloadEGoods?: boolean | null, giftCardPurchased?: boolean | null, orderConfirmation?: boolean | null, orderIsReadyForPickup?: boolean | null, orderShipped?: boolean | null, orderStatusChanged?: boolean | null, orderConfirmationSms?: boolean | null } | null, vendorNotifications?: { __typename?: 'VendorNotification', orderConfirmationSms?: boolean | null } | null, review?: { __typename?: 'ReviewSetting', enabled?: boolean | null, moderate?: boolean | null } | null, shipping?: { __typename?: 'Shipping', charge?: number | null, deliveryDays?: number | null, enabled?: boolean | null, free?: number | null, method?: string | null, provider?: string | null } | null, sms?: { __typename?: 'Sms', AUTO_VERIFICATION_ID?: string | null } | null, storeTiming?: Array<{ __typename?: 'StoreTiming', day?: string | null, fromTime?: string | null, index?: number | null, isOpen?: boolean | null, online?: boolean | null, toTime?: string | null } | null> | null } | null };

export type StoreOneQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']>;
  slug?: InputMaybe<Scalars['String']>;
  domain?: InputMaybe<Scalars['String']>;
}>;


export type StoreOneQuery = { __typename?: 'Query', storeOne?: { __typename?: 'Store', id: string, active?: boolean | null, featured?: boolean | null, address?: string | null, alert?: string | null, analyticsTrackingId?: string | null, banners?: Array<string | null> | null, closed?: boolean | null, isWishlist?: boolean | null, isCart?: boolean | null, closedMessage?: string | null, description?: string | null, metaDescription?: string | null, dimentionUnit?: string | null, domain?: string | null, email?: string | null, facebook?: string | null, facebookPixelId?: string | null, facebookUrl?: string | null, favicon?: string | null, faviconCdn?: string | null, firstName?: string | null, freeShippingOn?: number | null, gdpr?: boolean | null, gdprCookieConsent?: string | null, google?: string | null, googleAdsTag?: string | null, homeMeta1?: string | null, homeMeta2?: string | null, homeMeta3?: string | null, homeMeta4?: string | null, img?: string | null, imgCdn?: string | null, images?: Array<string | null> | null, imagesCdn?: Array<string | null> | null, bankAccountNo?: string | null, bankAccountHolderName?: string | null, bankIfscCode?: string | null, bankSwiftCode?: string | null, instagram?: string | null, instagramUrl?: string | null, isHideNilStock?: boolean | null, isMegamenu?: boolean | null, isOpen?: boolean | null, isSearch?: boolean | null, isHyperlocal?: boolean | null, isFnb?: boolean | null, keywords?: string | null, lastName?: string | null, lat?: number | null, legalName?: string | null, linkedin?: string | null, lng?: number | null, locality?: string | null, logo?: string | null, logoDark?: string | null, logoMobile?: string | null, logoMobileDark?: string | null, logoCdn?: string | null, logoDarkCdn?: string | null, logoMobileCdn?: string | null, logoMobileDarkCdn?: string | null, minimumOrderValue?: number | null, minOrderValue?: number | null, name?: string | null, openGraphImage?: string | null, openGraphImageCdn?: string | null, pageSize?: number | null, phone?: string | null, pinterestTag?: string | null, pinterestUrl?: string | null, qrCode?: string | null, searchbarText?: string | null, shippingCharge?: number | null, shopAddress?: string | null, shopPhone?: string | null, slug?: string | null, snapChatPixel?: string | null, state?: string | null, storeId?: string | null, timeZone?: string | null, timing?: string | null, title?: string | null, twitter?: string | null, twitterUrl?: string | null, websiteEmail?: string | null, websiteLegalName?: string | null, websiteName?: string | null, weightUnit?: string | null, youtubeUrl?: string | null, webmail?: string | null, zip?: string | null, timeDisplayFormat?: string | null, priceDisplayFormat?: string | null, createdAt?: string | null, updatedAt?: string | null, shippoToken?: string | null, shipRocketEmail?: string | null, shipRocketPassword?: string | null, shipRocketChannelId?: string | null, pickrrAuthToken?: string | null, adminNotifications?: { __typename?: 'AdminNotification', lowStockNotification?: boolean | null, newOrderPlaced?: boolean | null } | null, customerOrderNotifications?: { __typename?: 'UserNotification', downloadEGoods?: boolean | null, giftCardPurchased?: boolean | null, orderConfirmation?: boolean | null, orderIsReadyForPickup?: boolean | null, orderShipped?: boolean | null, orderStatusChanged?: boolean | null, orderConfirmationSms?: boolean | null } | null, vendorNotifications?: { __typename?: 'VendorNotification', orderConfirmationSms?: boolean | null } | null, review?: { __typename?: 'ReviewSetting', enabled?: boolean | null, moderate?: boolean | null } | null, shipping?: { __typename?: 'Shipping', charge?: number | null, deliveryDays?: number | null, enabled?: boolean | null, free?: number | null, method?: string | null, provider?: string | null } | null, sms?: { __typename?: 'Sms', AUTO_VERIFICATION_ID?: string | null } | null, user?: { __typename?: 'User', firstName?: string | null, lastName?: string | null, email?: string | null, phone?: string | null } | null, storeCountry?: { __typename?: 'StoreCountry', id?: string | null, default?: boolean | null, active?: boolean | null, name?: string | null, code?: string | null, country?: { __typename?: 'Country', id: string, name: string, value?: string | null, dialCode?: string | null, code?: string | null, img?: string | null, imgCdn?: string | null, flag?: string | null, lang?: string | null } | null } | null, storeCurrency?: { __typename?: 'StoreCurrency', id?: string | null, default?: boolean | null, active?: boolean | null, isoCode?: string | null, name?: string | null, symbol?: string | null, currency?: { __typename?: 'Currency', id?: string | null, name?: string | null, sort?: number | null, isoCode?: string | null, isoNumericCode?: number | null, thousandsSeparator?: string | null, decimalMark?: string | null, symbolFirst?: boolean | null, active?: boolean | null, symbol?: string | null, disambiguateSymbol?: string | null, htmlEntity?: string | null, subUnit?: string | null, smallestDenomination?: number | null, subunitToUnit?: number | null } | null } | null, storeLanguage?: { __typename?: 'StoreLanguage', id?: string | null, default?: boolean | null, active?: boolean | null, name?: string | null, code?: string | null, lang?: { __typename?: 'Language', id?: string | null, name?: string | null, nativeName?: string | null, code?: string | null, phpLocaleCode?: string | null, rtl?: boolean | null, sort?: number | null, active?: boolean | null } | null } | null } | null };

export type ChangePasswordMutationVariables = Exact<{
  oldPassword: Scalars['String'];
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword?: boolean | null };

export type EmailPasswordMutationVariables = Exact<{
  email: Scalars['String'];
  referrer: Scalars['String'];
}>;


export type EmailPasswordMutation = { __typename?: 'Mutation', emailPassword?: string | null };

export type GetOtpMutationVariables = Exact<{
  phone: Scalars['String'];
  role?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
}>;


export type GetOtpMutation = { __typename?: 'Mutation', getOtp?: { __typename?: 'Otp', otp?: string | null, timer?: number | null } | null };

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'User', id?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, city?: string | null, phone?: string | null, avatar?: string | null, avatarCdn?: string | null, role?: string | null, verified?: boolean | null, active?: boolean | null, provider?: string | null, vendor?: string | null, plan?: string | null, createdAt?: string | null, updatedAt?: string | null, store?: { __typename?: 'Store', name?: string | null } | null } | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'UserOne', id?: string | null, firstName?: string | null, lastName?: string | null, email?: string | null, phone?: string | null, gender?: string | null, role?: string | null, verified?: boolean | null, active?: boolean | null, provider?: string | null, avatar?: string | null, avatarCdn?: string | null, referralCode?: string | null, currentBalance?: number | null, store?: string | null } | null };

export type ResendEmailMutationVariables = Exact<{
  email?: InputMaybe<Scalars['String']>;
}>;


export type ResendEmailMutation = { __typename?: 'Mutation', resendEmail?: string | null };

export type SignOutMutationVariables = Exact<{ [key: string]: never; }>;


export type SignOutMutation = { __typename?: 'Mutation', signOut?: boolean | null };

export type TopVendorsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type TopVendorsQuery = { __typename?: 'Query', topVendors?: Array<{ __typename?: 'Vendor', id?: string | null, businessName?: string | null, productSold?: number | null, banner?: string | null, bannerCdn?: string | null } | null> | null };

export type UpdateProfileMutationVariables = Exact<{
  address?: InputMaybe<AddressInput>;
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  avatar?: InputMaybe<Scalars['String']>;
  dob?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
  info?: InputMaybe<InputInfo>;
  shippingCharges?: InputMaybe<Scalars['Int']>;
  freeShippingOn?: InputMaybe<Scalars['Int']>;
  storeName?: InputMaybe<Scalars['String']>;
  banner?: InputMaybe<Scalars['String']>;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateProfile?: { __typename?: 'UserOne', firstName?: string | null, lastName?: string | null, email?: string | null, phone?: string | null, avatar?: string | null, avatarCdn?: string | null, role?: string | null, gender?: string | null, city?: string | null, shippingCharges?: number | null, freeShippingOn?: number | null, storeName?: string | null, banner?: string | null, info?: { __typename?: 'Info', public?: boolean | null, store?: string | null } | null } | null };

export type VerifyEmailMutationVariables = Exact<{
  id: Scalars['ID'];
  token: Scalars['String'];
  expires: Scalars['String'];
  signature: Scalars['String'];
  store?: InputMaybe<Scalars['ID']>;
}>;


export type VerifyEmailMutation = { __typename?: 'Mutation', verifyEmail?: boolean | null };

export type VerifyOtpMutationVariables = Exact<{
  phone: Scalars['String'];
  otp: Scalars['String'];
  store?: InputMaybe<Scalars['ID']>;
}>;


export type VerifyOtpMutation = { __typename?: 'Mutation', verifyOtp?: { __typename?: 'User', id?: string | null, firstName?: string | null, lastName?: string | null, email?: string | null, phone?: string | null, role?: string | null, verified?: boolean | null, active?: boolean | null, avatar?: string | null, avatarCdn?: string | null, sid?: string | null } | null };

export type RandomVendorsQueryVariables = Exact<{
  store?: InputMaybe<Scalars['ID']>;
}>;


export type RandomVendorsQuery = { __typename?: 'Query', randomVendors?: Array<{ __typename?: 'Vendor', id?: string | null, slug?: string | null, businessName?: string | null, description?: string | null, verified?: boolean | null, bankAccountNo?: number | null, bankName?: string | null, bankIfsc?: string | null, bankAccountHolderName?: string | null, bankSwiftCode?: string | null, banner?: string | null, bannerCdn?: string | null, commissionType?: string | null, commissionValue?: number | null, zips?: Array<string | null> | null, freeShippingOn?: number | null, meta?: string | null, metaDescription?: string | null, metaKeywords?: string | null, metaTitle?: string | null, productSold?: number | null, ratings?: number | null, reviews?: number | null, shippingCharges?: number | null, storeName?: string | null, facebookUrl?: string | null, githubUrl?: string | null, googleUrl?: string | null, twitterUrl?: string | null, createdAt?: string | null, updatedAt?: string | null, user?: { __typename?: 'User', id?: string | null, avatar?: string | null, firstName?: string | null, lastName?: string | null } | null, address?: { __typename?: 'Address', id: string, email?: string | null, firstName?: string | null, lastName?: string | null, address?: string | null, locality?: string | null, town?: string | null, city?: string | null, country?: string | null, state?: string | null, zip?: string | null, phone?: string | null, lat?: number | null, lng?: number | null } | null, categories?: Array<{ __typename?: 'Category', id: string, name?: string | null, img?: string | null, imgCdn?: string | null } | null> | null } | null> | null };

export type VendorQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']>;
}>;


export type VendorQuery = { __typename?: 'Query', vendor?: { __typename?: 'Vendor', id?: string | null, slug?: string | null, businessName?: string | null, verified?: boolean | null, bankAccountNo?: number | null, bankName?: string | null, bankIfsc?: string | null, bankAccountHolderName?: string | null, bankSwiftCode?: string | null, banner?: string | null, bannerCdn?: string | null, commissionType?: string | null, commissionValue?: number | null, zips?: Array<string | null> | null, freeShippingOn?: number | null, meta?: string | null, metaDescription?: string | null, metaKeywords?: string | null, metaTitle?: string | null, productSold?: number | null, ratings?: number | null, reviews?: number | null, shippingCharges?: number | null, storeName?: string | null, facebookUrl?: string | null, githubUrl?: string | null, googleUrl?: string | null, twitterUrl?: string | null, about?: string | null, banners?: Array<string | null> | null, bannersCdn?: Array<string | null> | null, createdAt?: string | null, updatedAt?: string | null, categories?: Array<{ __typename?: 'Category', id: string, name?: string | null } | null> | null, info?: { __typename?: 'Info', public?: boolean | null, store?: string | null, storePhotos?: Array<string | null> | null } | null, country?: { __typename?: 'Country', id: string, name: string } | null, user?: { __typename?: 'User', id?: string | null, avatar?: string | null } | null, address?: { __typename?: 'Address', id: string, firstName?: string | null, lastName?: string | null, address?: string | null, locality?: string | null, city?: string | null, state?: string | null, country?: string | null, zip?: string | null, lat?: number | null, lng?: number | null } | null, store?: { __typename?: 'Store', id: string, name?: string | null, email?: string | null } | null } | null };

export type VendorProfileQueryVariables = Exact<{
  vendor: Scalars['ID'];
}>;


export type VendorProfileQuery = { __typename?: 'Query', vendorProfile?: { __typename?: 'Vendor', id?: string | null, slug?: string | null, businessName?: string | null, description?: string | null, verified?: boolean | null, bankAccountNo?: number | null, bankName?: string | null, bankIfsc?: string | null, bankAccountHolderName?: string | null, bankSwiftCode?: string | null, banner?: string | null, bannerCdn?: string | null, commissionType?: string | null, commissionValue?: number | null, zips?: Array<string | null> | null, freeShippingOn?: number | null, meta?: string | null, metaDescription?: string | null, metaKeywords?: string | null, metaTitle?: string | null, productSold?: number | null, ratings?: number | null, reviews?: number | null, shippingCharges?: number | null, storeName?: string | null, facebookUrl?: string | null, githubUrl?: string | null, googleUrl?: string | null, twitterUrl?: string | null, createdAt?: string | null, updatedAt?: string | null, user?: { __typename?: 'User', id?: string | null, avatar?: string | null, firstName?: string | null, lastName?: string | null } | null, address?: { __typename?: 'Address', id: string, email?: string | null, firstName?: string | null, lastName?: string | null, address?: string | null, locality?: string | null, town?: string | null, city?: string | null, country?: string | null, state?: string | null, zip?: string | null, phone?: string | null, lat?: number | null, lng?: number | null } | null, categories?: Array<{ __typename?: 'Category', id: string, name?: string | null, img?: string | null, imgCdn?: string | null } | null> | null, products?: { __typename?: 'SearchRes', count?: number | null, page?: number | null, pageSize?: number | null, data?: Array<{ __typename?: 'Product', id?: string | null, sku?: string | null, barcode?: string | null, productMasterId?: string | null, slug?: string | null, name?: string | null, description?: string | null, type?: string | null, price?: number | null, mrp?: number | null, stock?: number | null, trackInventory?: boolean | null, tax?: number | null, img?: string | null, imgCdn?: string | null, images?: Array<string | null> | null, imagesCdn?: Array<string | null> | null, time?: string | null, active?: boolean | null, popularity?: number | null, position?: number | null, trending?: boolean | null, featured?: boolean | null, hot?: boolean | null, new?: boolean | null, sale?: boolean | null, recommended?: boolean | null, title?: string | null, metaDescription?: string | null, keywords?: string | null, keywordsA?: Array<string | null> | null, ratings?: number | null, reviews?: number | null, itemId?: string | null, warranty?: string | null, ageMin?: number | null, ageMax?: number | null, ageUnit?: string | null, cgst?: number | null, sgst?: number | null, igst?: number | null, returnInfo?: string | null, returnAllowed?: boolean | null, replaceAllowed?: boolean | null, returnValidityInDays?: number | null, sizechart?: string | null, batchNo?: string | null, mfgDate?: string | null, expired?: boolean | null, expiryDate?: string | null, isSearchable?: boolean | null, isUnlimited?: boolean | null, totalSold?: number | null, preOrder?: boolean | null, zips?: Array<string> | null, foodType?: string | null, deliveryDetails?: string | null } | null> | null } | null } | null };

export type CheckWishlistQueryVariables = Exact<{
  product: Scalars['ID'];
  variant: Scalars['ID'];
}>;


export type CheckWishlistQuery = { __typename?: 'Query', checkWishlist?: boolean | null };

export type MyWishlistQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  store?: InputMaybe<Scalars['ID']>;
}>;


export type MyWishlistQuery = { __typename?: 'Query', myWishlist?: { __typename?: 'wishlistRes', count?: number | null, page?: number | null, pageSize?: number | null, data?: Array<{ __typename?: 'Wishlist', id?: string | null, active?: boolean | null, createdAt?: string | null, updatedAt?: string | null, product?: { __typename?: 'Product', id?: string | null, name?: string | null, slug?: string | null, img?: string | null, price?: number | null, mrp?: number | null, formattedPrice?: string | null, discount?: number | null, foodType?: string | null, vendor?: { __typename?: 'Vendor', id?: string | null, slug?: string | null, businessName?: string | null, banner?: string | null, bannerCdn?: string | null } | null, brand?: { __typename?: 'Brand', id: string, name?: string | null, img?: string | null } | null } | null, variant?: { __typename?: 'Product', id?: string | null, name?: string | null } | null, user?: { __typename?: 'User', id?: string | null, firstName?: string | null, lastName?: string | null } | null, store?: { __typename?: 'Store', id: string, name?: string | null, email?: string | null } | null } | null> | null } | null };

export type ToggleWishlistMutationVariables = Exact<{
  product: Scalars['ID'];
  variant: Scalars['ID'];
}>;


export type ToggleWishlistMutation = { __typename?: 'Mutation', toggleWishlist?: boolean | null };


export const RemoveStoreCountryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removeStoreCountry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeStoreCountry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<RemoveStoreCountryMutation, RemoveStoreCountryMutationVariables>;
export const SaveStoreCountryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"saveStoreCountry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"country"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"default"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"active"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saveStoreCountry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"country"},"value":{"kind":"Variable","name":{"kind":"Name","value":"country"}}},{"kind":"Argument","name":{"kind":"Name","value":"default"},"value":{"kind":"Variable","name":{"kind":"Name","value":"default"}}},{"kind":"Argument","name":{"kind":"Name","value":"active"},"value":{"kind":"Variable","name":{"kind":"Name","value":"active"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"default"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"user"}},{"kind":"Field","name":{"kind":"Name","value":"store"}}]}}]}}]} as unknown as DocumentNode<SaveStoreCountryMutation, SaveStoreCountryMutationVariables>;
export const StoreCountriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"storeCountries"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"store"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storeCountries"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"store"},"value":{"kind":"Variable","name":{"kind":"Name","value":"store"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"default"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"country"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"dialCode"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"flag"}},{"kind":"Field","name":{"kind":"Name","value":"lang"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]}}]} as unknown as DocumentNode<StoreCountriesQuery, StoreCountriesQueryVariables>;
export const StoreCountryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"storeCountry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storeCountry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"default"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"country"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"dialCode"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"flag"}},{"kind":"Field","name":{"kind":"Name","value":"lang"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]}}]} as unknown as DocumentNode<StoreCountryQuery, StoreCountryQueryVariables>;
export const AddressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"address"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"locality"}},{"kind":"Field","name":{"kind":"Name","value":"town"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zip"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<AddressQuery, AddressQueryVariables>;
export const AddressesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"addresses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"store"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addresses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"store"},"value":{"kind":"Variable","name":{"kind":"Name","value":"store"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"locality"}},{"kind":"Field","name":{"kind":"Name","value":"town"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zip"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"store"}}]}}]}}]}}]} as unknown as DocumentNode<AddressesQuery, AddressesQueryVariables>;
export const DeleteAddressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteAddress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteAddress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteAddressMutation, DeleteAddressMutationVariables>;
export const MyAddressesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"myAddresses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myAddresses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"locality"}},{"kind":"Field","name":{"kind":"Name","value":"town"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zip"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<MyAddressesQuery, MyAddressesQueryVariables>;
export const SaveAddressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"saveAddress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"address"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locality"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"town"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"district"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"city"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"country"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"state"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"zip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"phone"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lat"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lng"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"store"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isResidential"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saveAddress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"firstName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}}},{"kind":"Argument","name":{"kind":"Name","value":"lastName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"address"}}},{"kind":"Argument","name":{"kind":"Name","value":"locality"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locality"}}},{"kind":"Argument","name":{"kind":"Name","value":"town"},"value":{"kind":"Variable","name":{"kind":"Name","value":"town"}}},{"kind":"Argument","name":{"kind":"Name","value":"district"},"value":{"kind":"Variable","name":{"kind":"Name","value":"district"}}},{"kind":"Argument","name":{"kind":"Name","value":"city"},"value":{"kind":"Variable","name":{"kind":"Name","value":"city"}}},{"kind":"Argument","name":{"kind":"Name","value":"country"},"value":{"kind":"Variable","name":{"kind":"Name","value":"country"}}},{"kind":"Argument","name":{"kind":"Name","value":"state"},"value":{"kind":"Variable","name":{"kind":"Name","value":"state"}}},{"kind":"Argument","name":{"kind":"Name","value":"zip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"zip"}}},{"kind":"Argument","name":{"kind":"Name","value":"phone"},"value":{"kind":"Variable","name":{"kind":"Name","value":"phone"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"lat"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lat"}}},{"kind":"Argument","name":{"kind":"Name","value":"lng"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lng"}}},{"kind":"Argument","name":{"kind":"Name","value":"store"},"value":{"kind":"Variable","name":{"kind":"Name","value":"store"}}},{"kind":"Argument","name":{"kind":"Name","value":"isResidential"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isResidential"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"locality"}},{"kind":"Field","name":{"kind":"Name","value":"town"}},{"kind":"Field","name":{"kind":"Name","value":"district"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zip"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}},{"kind":"Field","name":{"kind":"Name","value":"isResidential"}},{"kind":"Field","name":{"kind":"Name","value":"store"}}]}}]}}]} as unknown as DocumentNode<SaveAddressMutation, SaveAddressMutationVariables>;
export const BlogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"blog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"store"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]}}]} as unknown as DocumentNode<BlogQuery, BlogQueryVariables>;
export const BlogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"blogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"store"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"store"},"value":{"kind":"Variable","name":{"kind":"Name","value":"store"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"store"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]}}]}}]} as unknown as DocumentNode<BlogsQuery, BlogsQueryVariables>;
export const DeleteBlogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteBlog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteBlog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteBlogMutation, DeleteBlogMutationVariables>;
export const SaveBlogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"saveBlog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"excerpt"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"published_at"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"img"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tags"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"active"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saveBlog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}},{"kind":"Argument","name":{"kind":"Name","value":"excerpt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"excerpt"}}},{"kind":"Argument","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"Argument","name":{"kind":"Name","value":"published_at"},"value":{"kind":"Variable","name":{"kind":"Name","value":"published_at"}}},{"kind":"Argument","name":{"kind":"Name","value":"img"},"value":{"kind":"Variable","name":{"kind":"Name","value":"img"}}},{"kind":"Argument","name":{"kind":"Name","value":"tags"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tags"}}},{"kind":"Argument","name":{"kind":"Name","value":"active"},"value":{"kind":"Variable","name":{"kind":"Name","value":"active"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}}]} as unknown as DocumentNode<SaveBlogMutation, SaveBlogMutationVariables>;
export const AddToCartDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addToCart"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"qty"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"vid"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OptionIp1"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"vendor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"replace"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addToCart"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"qty"},"value":{"kind":"Variable","name":{"kind":"Name","value":"qty"}}},{"kind":"Argument","name":{"kind":"Name","value":"pid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pid"}}},{"kind":"Argument","name":{"kind":"Name","value":"vid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"vid"}}},{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}},{"kind":"Argument","name":{"kind":"Name","value":"vendor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"vendor"}}},{"kind":"Argument","name":{"kind":"Name","value":"replace"},"value":{"kind":"Variable","name":{"kind":"Name","value":"replace"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pid"}},{"kind":"Field","name":{"kind":"Name","value":"vid"}},{"kind":"Field","name":{"kind":"Name","value":"barcode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"qty"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"shippingCharge"}},{"kind":"Field","name":{"kind":"Name","value":"tax"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"brandName"}},{"kind":"Field","name":{"kind":"Name","value":"vendor"}},{"kind":"Field","name":{"kind":"Name","value":"vendorSlug"}},{"kind":"Field","name":{"kind":"Name","value":"vendorBusinessName"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryDetails"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"option"}},{"kind":"Field","name":{"kind":"Name","value":"values"}}]}},{"kind":"Field","name":{"kind":"Name","value":"usedOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"val"}},{"kind":"Field","name":{"kind":"Name","value":"dates"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"needAddress"}},{"kind":"Field","name":{"kind":"Name","value":"qty"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"discount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shipping"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"charge"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<AddToCartMutation, AddToCartMutationVariables>;
export const CartDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"cart"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"store"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cart"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"store"},"value":{"kind":"Variable","name":{"kind":"Name","value":"store"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"storeCurrency"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"currencyName"}},{"kind":"Field","name":{"kind":"Name","value":"currencySymbol"}},{"kind":"Field","name":{"kind":"Name","value":"needAddress"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pid"}},{"kind":"Field","name":{"kind":"Name","value":"barcode"}},{"kind":"Field","name":{"kind":"Name","value":"tax"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"qty"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"mrp"}},{"kind":"Field","name":{"kind":"Name","value":"shippingCharge"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"tracking"}},{"kind":"Field","name":{"kind":"Name","value":"brandName"}},{"kind":"Field","name":{"kind":"Name","value":"vendor"}},{"kind":"Field","name":{"kind":"Name","value":"vendorSlug"}},{"kind":"Field","name":{"kind":"Name","value":"vendorBusinessName"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryDetails"}},{"kind":"Field","name":{"kind":"Name","value":"foodType"}},{"kind":"Field","name":{"kind":"Name","value":"usedOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"val"}},{"kind":"Field","name":{"kind":"Name","value":"dates"}}]}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"option"}},{"kind":"Field","name":{"kind":"Name","value":"values"}}]}},{"kind":"Field","name":{"kind":"Name","value":"formattedItemAmount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mrp"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"tax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingCharge"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"qty"}},{"kind":"Field","name":{"kind":"Name","value":"tax"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"discount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shipping"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"charge"}}]}},{"kind":"Field","name":{"kind":"Name","value":"formattedAmount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"offer_total"}},{"kind":"Field","name":{"kind":"Name","value":"tax"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unavailableItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"msg"}},{"kind":"Field","name":{"kind":"Name","value":"pid"}},{"kind":"Field","name":{"kind":"Name","value":"barcode"}},{"kind":"Field","name":{"kind":"Name","value":"tax"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"qty"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"mrp"}},{"kind":"Field","name":{"kind":"Name","value":"shippingCharge"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"tracking"}},{"kind":"Field","name":{"kind":"Name","value":"brandName"}},{"kind":"Field","name":{"kind":"Name","value":"vendor"}},{"kind":"Field","name":{"kind":"Name","value":"vendorSlug"}},{"kind":"Field","name":{"kind":"Name","value":"vendorBusinessName"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryDetails"}},{"kind":"Field","name":{"kind":"Name","value":"foodType"}},{"kind":"Field","name":{"kind":"Name","value":"usedOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"val"}},{"kind":"Field","name":{"kind":"Name","value":"dates"}}]}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"option"}},{"kind":"Field","name":{"kind":"Name","value":"values"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CartQuery, CartQueryVariables>;
export const CheckoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"checkout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"address"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slot"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkout"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"address"}}},{"kind":"Argument","name":{"kind":"Name","value":"slot"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slot"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderNo"}},{"kind":"Field","name":{"kind":"Name","value":"otp"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"payment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paymentMode"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"paymentCurrency"}},{"kind":"Field","name":{"kind":"Name","value":"paymentReferenceId"}},{"kind":"Field","name":{"kind":"Name","value":"paymentOrderId"}},{"kind":"Field","name":{"kind":"Name","value":"paymentReceipt"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceId"}},{"kind":"Field","name":{"kind":"Name","value":"paymentGateway"}},{"kind":"Field","name":{"kind":"Name","value":"codPaid"}},{"kind":"Field","name":{"kind":"Name","value":"baseCodPaid"}},{"kind":"Field","name":{"kind":"Name","value":"amountPaid"}},{"kind":"Field","name":{"kind":"Name","value":"amountDue"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"paymentMsg"}},{"kind":"Field","name":{"kind":"Name","value":"paymentTime"}},{"kind":"Field","name":{"kind":"Name","value":"paid"}},{"kind":"Field","name":{"kind":"Name","value":"amount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"qty"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"tax"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}}]}},{"kind":"Field","name":{"kind":"Name","value":"baseAmount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"tax"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"userLastName"}},{"kind":"Field","name":{"kind":"Name","value":"userPhone"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"store"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"town"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zip"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pid"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"posInvoiceNo"}},{"kind":"Field","name":{"kind":"Name","value":"itemOrderNo"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"barcode"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"basePrice"}},{"kind":"Field","name":{"kind":"Name","value":"qty"}},{"kind":"Field","name":{"kind":"Name","value":"shippingCharge"}},{"kind":"Field","name":{"kind":"Name","value":"baseShippingCharge"}},{"kind":"Field","name":{"kind":"Name","value":"tax"}},{"kind":"Field","name":{"kind":"Name","value":"baseTax"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"baseSubtotal"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"baseTotal"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"brandName"}},{"kind":"Field","name":{"kind":"Name","value":"brandImg"}},{"kind":"Field","name":{"kind":"Name","value":"brandImgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"parentBrandName"}},{"kind":"Field","name":{"kind":"Name","value":"parentBrandImg"}},{"kind":"Field","name":{"kind":"Name","value":"parentBrandImgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"vendorAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"town"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zip"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vendor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"businessName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"orderItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CheckoutMutation, CheckoutMutationVariables>;
export const CategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"categories"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"megamenu"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"featured"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"active"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"img"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"shopbycategory"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"store"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"megamenu"},"value":{"kind":"Variable","name":{"kind":"Name","value":"megamenu"}}},{"kind":"Argument","name":{"kind":"Name","value":"featured"},"value":{"kind":"Variable","name":{"kind":"Name","value":"featured"}}},{"kind":"Argument","name":{"kind":"Name","value":"active"},"value":{"kind":"Variable","name":{"kind":"Name","value":"active"}}},{"kind":"Argument","name":{"kind":"Name","value":"img"},"value":{"kind":"Variable","name":{"kind":"Name","value":"img"}}},{"kind":"Argument","name":{"kind":"Name","value":"shopbycategory"},"value":{"kind":"Variable","name":{"kind":"Name","value":"shopbycategory"}}},{"kind":"Argument","name":{"kind":"Name","value":"store"},"value":{"kind":"Variable","name":{"kind":"Name","value":"store"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"namePath"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"parent"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"bannerCdn"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"metaTitle"}},{"kind":"Field","name":{"kind":"Name","value":"metaDescription"}},{"kind":"Field","name":{"kind":"Name","value":"metaKeywords"}},{"kind":"Field","name":{"kind":"Name","value":"keywords"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"megamenu"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"featuredSort"}},{"kind":"Field","name":{"kind":"Name","value":"shopbycategory"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"store"}}]}}]}}]}}]} as unknown as DocumentNode<CategoriesQuery, CategoriesQueryVariables>;
export const CategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"category"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"bannerCdn"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"pathA"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metaTitle"}},{"kind":"Field","name":{"kind":"Name","value":"metaDescription"}},{"kind":"Field","name":{"kind":"Name","value":"metaKeywords"}},{"kind":"Field","name":{"kind":"Name","value":"keywords"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"megamenu"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"featuredSort"}},{"kind":"Field","name":{"kind":"Name","value":"shopbycategory"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"img"}}]}},{"kind":"Field","name":{"kind":"Name","value":"attributes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"show"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}},{"kind":"Field","name":{"kind":"Name","value":"brand"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<CategoryQuery, CategoryQueryVariables>;
export const MegamenuDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"megamenu"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"featured"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"brand"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"store"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"megamenu"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"featured"},"value":{"kind":"Variable","name":{"kind":"Name","value":"featured"}}},{"kind":"Argument","name":{"kind":"Name","value":"brand"},"value":{"kind":"Variable","name":{"kind":"Name","value":"brand"}}},{"kind":"Argument","name":{"kind":"Name","value":"store"},"value":{"kind":"Variable","name":{"kind":"Name","value":"store"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"bannerCdn"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<MegamenuQuery, MegamenuQueryVariables>;
export const CountriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"countries"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"countries"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"dialCode"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"flag"}},{"kind":"Field","name":{"kind":"Name","value":"lang"}},{"kind":"Field","name":{"kind":"Name","value":"states"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}}]}}]} as unknown as DocumentNode<CountriesQuery, CountriesQueryVariables>;
export const CountryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"country"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"country"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"dialCode"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"flag"}},{"kind":"Field","name":{"kind":"Name","value":"lang"}},{"kind":"Field","name":{"kind":"Name","value":"states"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}}]} as unknown as DocumentNode<CountryQuery, CountryQueryVariables>;
export const DeleteCountryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteCountry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCountry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteCountryMutation, DeleteCountryMutationVariables>;
export const SaveCountryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"saveCountry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"value"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dialCode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"img"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"flag"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lang"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"active"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saveCountry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"value"},"value":{"kind":"Variable","name":{"kind":"Name","value":"value"}}},{"kind":"Argument","name":{"kind":"Name","value":"dialCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dialCode"}}},{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}},{"kind":"Argument","name":{"kind":"Name","value":"img"},"value":{"kind":"Variable","name":{"kind":"Name","value":"img"}}},{"kind":"Argument","name":{"kind":"Name","value":"flag"},"value":{"kind":"Variable","name":{"kind":"Name","value":"flag"}}},{"kind":"Argument","name":{"kind":"Name","value":"lang"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lang"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"active"},"value":{"kind":"Variable","name":{"kind":"Name","value":"active"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"dialCode"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"flag"}},{"kind":"Field","name":{"kind":"Name","value":"lang"}},{"kind":"Field","name":{"kind":"Name","value":"states"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<SaveCountryMutation, SaveCountryMutationVariables>;
export const InitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"INIT"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"domain"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"websiteName"}},{"kind":"Field","name":{"kind":"Name","value":"websiteLegalName"}},{"kind":"Field","name":{"kind":"Name","value":"liveCommerce"}},{"kind":"Field","name":{"kind":"Name","value":"multilingual"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"closedMessage"}},{"kind":"Field","name":{"kind":"Name","value":"minimumOrderValue"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"alert"}},{"kind":"Field","name":{"kind":"Name","value":"keywords"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cgst"}},{"kind":"Field","name":{"kind":"Name","value":"sgst"}},{"kind":"Field","name":{"kind":"Name","value":"igst"}}]}},{"kind":"Field","name":{"kind":"Name","value":"demo"}},{"kind":"Field","name":{"kind":"Name","value":"RAZORPAY_KEY_ID"}},{"kind":"Field","name":{"kind":"Name","value":"GOOGLE_CLIENT_ID"}},{"kind":"Field","name":{"kind":"Name","value":"LIVE_COMMERCE_URL"}},{"kind":"Field","name":{"kind":"Name","value":"stripePublishableKey"}},{"kind":"Field","name":{"kind":"Name","value":"brainTreePublicKey"}},{"kind":"Field","name":{"kind":"Name","value":"enableStripe"}},{"kind":"Field","name":{"kind":"Name","value":"enableRazorpay"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"currencySymbol"}},{"kind":"Field","name":{"kind":"Name","value":"currencyDecimals"}},{"kind":"Field","name":{"kind":"Name","value":"openGraphImage"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deliveryDays"}},{"kind":"Field","name":{"kind":"Name","value":"charge"}},{"kind":"Field","name":{"kind":"Name","value":"free"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userRoles"}},{"kind":"Field","name":{"kind":"Name","value":"websiteEmail"}},{"kind":"Field","name":{"kind":"Name","value":"shopPhone"}},{"kind":"Field","name":{"kind":"Name","value":"shopAddress"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"countryDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"dialCode"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"flag"}},{"kind":"Field","name":{"kind":"Name","value":"lang"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"currencyDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isoCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"logoMobile"}},{"kind":"Field","name":{"kind":"Name","value":"logoDark"}},{"kind":"Field","name":{"kind":"Name","value":"logoMobileDark"}},{"kind":"Field","name":{"kind":"Name","value":"favicon"}},{"kind":"Field","name":{"kind":"Name","value":"CDN_URL"}},{"kind":"Field","name":{"kind":"Name","value":"S3_URL"}},{"kind":"Field","name":{"kind":"Name","value":"searchbarText"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"returnReasons"}},{"kind":"Field","name":{"kind":"Name","value":"orderStatuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"public"}},{"kind":"Field","name":{"kind":"Name","value":"index"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatuses"}},{"kind":"Field","name":{"kind":"Name","value":"paymentMethods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"Field","name":{"kind":"Name","value":"otpLogin"}},{"kind":"Field","name":{"kind":"Name","value":"sms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"AUTO_VERIFICATION_ID"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}}]}},{"kind":"Field","name":{"kind":"Name","value":"email"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"cc"}},{"kind":"Field","name":{"kind":"Name","value":"bcc"}},{"kind":"Field","name":{"kind":"Name","value":"printers"}}]}},{"kind":"Field","name":{"kind":"Name","value":"storage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}}]}},{"kind":"Field","name":{"kind":"Name","value":"review"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"moderate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moderate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customerOrderNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderConfirmation"}},{"kind":"Field","name":{"kind":"Name","value":"orderStatusChanged"}},{"kind":"Field","name":{"kind":"Name","value":"orderShipped"}},{"kind":"Field","name":{"kind":"Name","value":"orderIsReadyForPickup"}},{"kind":"Field","name":{"kind":"Name","value":"downloadEGoods"}},{"kind":"Field","name":{"kind":"Name","value":"giftCardPurchased"}}]}},{"kind":"Field","name":{"kind":"Name","value":"adminNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newOrderPlaced"}},{"kind":"Field","name":{"kind":"Name","value":"lowStockNotification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ADMIN_PANEL_LINK"}},{"kind":"Field","name":{"kind":"Name","value":"DOCS_LINK"}},{"kind":"Field","name":{"kind":"Name","value":"storageProvider"}},{"kind":"Field","name":{"kind":"Name","value":"googleMapsApi"}},{"kind":"Field","name":{"kind":"Name","value":"facebook"}},{"kind":"Field","name":{"kind":"Name","value":"twitter"}},{"kind":"Field","name":{"kind":"Name","value":"google"}},{"kind":"Field","name":{"kind":"Name","value":"instagram"}},{"kind":"Field","name":{"kind":"Name","value":"linkedin"}},{"kind":"Field","name":{"kind":"Name","value":"enableTax"}},{"kind":"Field","name":{"kind":"Name","value":"locationExpiry"}},{"kind":"Field","name":{"kind":"Name","value":"WWW_URL"}},{"kind":"Field","name":{"kind":"Name","value":"referralBonus"}},{"kind":"Field","name":{"kind":"Name","value":"joiningBonus"}},{"kind":"Field","name":{"kind":"Name","value":"isMultiVendor"}},{"kind":"Field","name":{"kind":"Name","value":"isMultiStore"}},{"kind":"Field","name":{"kind":"Name","value":"isMegamenu"}},{"kind":"Field","name":{"kind":"Name","value":"isSaas"}},{"kind":"Field","name":{"kind":"Name","value":"isSearch"}},{"kind":"Field","name":{"kind":"Name","value":"foodTypes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"val"}},{"kind":"Field","name":{"kind":"Name","value":"img"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"storeOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"domain"},"value":{"kind":"Variable","name":{"kind":"Name","value":"domain"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"adminNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lowStockNotification"}},{"kind":"Field","name":{"kind":"Name","value":"newOrderPlaced"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"alert"}},{"kind":"Field","name":{"kind":"Name","value":"analyticsTrackingId"}},{"kind":"Field","name":{"kind":"Name","value":"banners"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"isWishlist"}},{"kind":"Field","name":{"kind":"Name","value":"isCart"}},{"kind":"Field","name":{"kind":"Name","value":"closedMessage"}},{"kind":"Field","name":{"kind":"Name","value":"customerOrderNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"downloadEGoods"}},{"kind":"Field","name":{"kind":"Name","value":"giftCardPurchased"}},{"kind":"Field","name":{"kind":"Name","value":"orderConfirmation"}},{"kind":"Field","name":{"kind":"Name","value":"orderIsReadyForPickup"}},{"kind":"Field","name":{"kind":"Name","value":"orderShipped"}},{"kind":"Field","name":{"kind":"Name","value":"orderStatusChanged"}},{"kind":"Field","name":{"kind":"Name","value":"orderConfirmationSms"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vendorNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderConfirmationSms"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"metaDescription"}},{"kind":"Field","name":{"kind":"Name","value":"dimentionUnit"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"facebook"}},{"kind":"Field","name":{"kind":"Name","value":"facebookPixelId"}},{"kind":"Field","name":{"kind":"Name","value":"facebookUrl"}},{"kind":"Field","name":{"kind":"Name","value":"favicon"}},{"kind":"Field","name":{"kind":"Name","value":"faviconCdn"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"freeShippingOn"}},{"kind":"Field","name":{"kind":"Name","value":"gdpr"}},{"kind":"Field","name":{"kind":"Name","value":"gdprCookieConsent"}},{"kind":"Field","name":{"kind":"Name","value":"google"}},{"kind":"Field","name":{"kind":"Name","value":"googleAdsTag"}},{"kind":"Field","name":{"kind":"Name","value":"homeMeta1"}},{"kind":"Field","name":{"kind":"Name","value":"homeMeta2"}},{"kind":"Field","name":{"kind":"Name","value":"homeMeta3"}},{"kind":"Field","name":{"kind":"Name","value":"homeMeta4"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"imagesCdn"}},{"kind":"Field","name":{"kind":"Name","value":"bankAccountNo"}},{"kind":"Field","name":{"kind":"Name","value":"bankAccountHolderName"}},{"kind":"Field","name":{"kind":"Name","value":"bankIfscCode"}},{"kind":"Field","name":{"kind":"Name","value":"bankSwiftCode"}},{"kind":"Field","name":{"kind":"Name","value":"instagram"}},{"kind":"Field","name":{"kind":"Name","value":"instagramUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isHideNilStock"}},{"kind":"Field","name":{"kind":"Name","value":"isMegamenu"}},{"kind":"Field","name":{"kind":"Name","value":"isOpen"}},{"kind":"Field","name":{"kind":"Name","value":"isSearch"}},{"kind":"Field","name":{"kind":"Name","value":"isHyperlocal"}},{"kind":"Field","name":{"kind":"Name","value":"isFnb"}},{"kind":"Field","name":{"kind":"Name","value":"isWishlist"}},{"kind":"Field","name":{"kind":"Name","value":"isCart"}},{"kind":"Field","name":{"kind":"Name","value":"keywords"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"legalName"}},{"kind":"Field","name":{"kind":"Name","value":"linkedin"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}},{"kind":"Field","name":{"kind":"Name","value":"locality"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"logoDark"}},{"kind":"Field","name":{"kind":"Name","value":"logoMobile"}},{"kind":"Field","name":{"kind":"Name","value":"logoMobileDark"}},{"kind":"Field","name":{"kind":"Name","value":"logoCdn"}},{"kind":"Field","name":{"kind":"Name","value":"logoDarkCdn"}},{"kind":"Field","name":{"kind":"Name","value":"logoMobileCdn"}},{"kind":"Field","name":{"kind":"Name","value":"logoMobileDarkCdn"}},{"kind":"Field","name":{"kind":"Name","value":"minimumOrderValue"}},{"kind":"Field","name":{"kind":"Name","value":"minOrderValue"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"openGraphImage"}},{"kind":"Field","name":{"kind":"Name","value":"openGraphImageCdn"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"pinterestTag"}},{"kind":"Field","name":{"kind":"Name","value":"pinterestUrl"}},{"kind":"Field","name":{"kind":"Name","value":"qrCode"}},{"kind":"Field","name":{"kind":"Name","value":"review"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"moderate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"searchbarText"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"charge"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryDays"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"free"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingCharge"}},{"kind":"Field","name":{"kind":"Name","value":"shopAddress"}},{"kind":"Field","name":{"kind":"Name","value":"shopPhone"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"snapChatPixel"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"timeZone"}},{"kind":"Field","name":{"kind":"Name","value":"timing"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"twitter"}},{"kind":"Field","name":{"kind":"Name","value":"twitterUrl"}},{"kind":"Field","name":{"kind":"Name","value":"websiteEmail"}},{"kind":"Field","name":{"kind":"Name","value":"websiteLegalName"}},{"kind":"Field","name":{"kind":"Name","value":"websiteName"}},{"kind":"Field","name":{"kind":"Name","value":"weightUnit"}},{"kind":"Field","name":{"kind":"Name","value":"youtubeUrl"}},{"kind":"Field","name":{"kind":"Name","value":"webmail"}},{"kind":"Field","name":{"kind":"Name","value":"zip"}},{"kind":"Field","name":{"kind":"Name","value":"timeDisplayFormat"}},{"kind":"Field","name":{"kind":"Name","value":"priceDisplayFormat"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"sms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"AUTO_VERIFICATION_ID"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippoToken"}},{"kind":"Field","name":{"kind":"Name","value":"shipRocketEmail"}},{"kind":"Field","name":{"kind":"Name","value":"shipRocketPassword"}},{"kind":"Field","name":{"kind":"Name","value":"shipRocketChannelId"}},{"kind":"Field","name":{"kind":"Name","value":"pickrrAuthToken"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"storeCountry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"default"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"country"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"dialCode"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"flag"}},{"kind":"Field","name":{"kind":"Name","value":"lang"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"storeCurrency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"default"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"isoCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"currency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"isoCode"}},{"kind":"Field","name":{"kind":"Name","value":"isoNumericCode"}},{"kind":"Field","name":{"kind":"Name","value":"thousandsSeparator"}},{"kind":"Field","name":{"kind":"Name","value":"decimalMark"}},{"kind":"Field","name":{"kind":"Name","value":"symbolFirst"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"disambiguateSymbol"}},{"kind":"Field","name":{"kind":"Name","value":"htmlEntity"}},{"kind":"Field","name":{"kind":"Name","value":"subUnit"}},{"kind":"Field","name":{"kind":"Name","value":"smallestDenomination"}},{"kind":"Field","name":{"kind":"Name","value":"subunitToUnit"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"storeLanguage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"default"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"lang"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nativeName"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"phpLocaleCode"}},{"kind":"Field","name":{"kind":"Name","value":"rtl"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"megamenu"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"domain"},"value":{"kind":"Variable","name":{"kind":"Name","value":"domain"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<InitQuery, InitQueryVariables>;
export const HomeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HOME"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"store"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"zip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"brands"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"parent"},"value":{"kind":"NullValue"}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"30"}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"IntValue","value":"0"}},{"kind":"Argument","name":{"kind":"Name","value":"featured"},"value":{"kind":"BooleanValue","value":true}},{"kind":"Argument","name":{"kind":"Name","value":"store"},"value":{"kind":"Variable","name":{"kind":"Name","value":"store"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"brandId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"info"}},{"kind":"Field","name":{"kind":"Name","value":"meta"}},{"kind":"Field","name":{"kind":"Name","value":"metaTitle"}},{"kind":"Field","name":{"kind":"Name","value":"metaDescription"}},{"kind":"Field","name":{"kind":"Name","value":"metaKeywords"}},{"kind":"Field","name":{"kind":"Name","value":"facebookUrl"}},{"kind":"Field","name":{"kind":"Name","value":"instaUrl"}},{"kind":"Field","name":{"kind":"Name","value":"twitterUrl"}},{"kind":"Field","name":{"kind":"Name","value":"linkedinUrl"}},{"kind":"Field","name":{"kind":"Name","value":"youtubeUrl"}},{"kind":"Field","name":{"kind":"Name","value":"pinterestUrl"}},{"kind":"Field","name":{"kind":"Name","value":"googleUrl"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"store"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"img"},"value":{"kind":"BooleanValue","value":true}},{"kind":"Argument","name":{"kind":"Name","value":"shopbycategory"},"value":{"kind":"BooleanValue","value":true}},{"kind":"Argument","name":{"kind":"Name","value":"store"},"value":{"kind":"Variable","name":{"kind":"Name","value":"store"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"StringValue","value":"featuredSort","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"namePath"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"parent"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"metaTitle"}},{"kind":"Field","name":{"kind":"Name","value":"metaDescription"}},{"kind":"Field","name":{"kind":"Name","value":"metaKeywords"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"megamenu"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"shopbycategory"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"store"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"banners"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"StringValue","value":"sort","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"pageId"},"value":{"kind":"StringValue","value":"home","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"active"},"value":{"kind":"BooleanValue","value":true}},{"kind":"Argument","name":{"kind":"Name","value":"store"},"value":{"kind":"Variable","name":{"kind":"Name","value":"store"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"heading"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"pageId"}},{"kind":"Field","name":{"kind":"Name","value":"groupId"}},{"kind":"Field","name":{"kind":"Name","value":"groupTitle"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"isMobile"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"store"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"youMayLike"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"store"},"value":{"kind":"Variable","name":{"kind":"Name","value":"store"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"barcode"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"productMasterId"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"foodType"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"mrp"}},{"kind":"Field","name":{"kind":"Name","value":"stock"}},{"kind":"Field","name":{"kind":"Name","value":"tax"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"imagesCdn"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"trending"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"hot"}},{"kind":"Field","name":{"kind":"Name","value":"new"}},{"kind":"Field","name":{"kind":"Name","value":"sale"}},{"kind":"Field","name":{"kind":"Name","value":"recommended"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"metaDescription"}},{"kind":"Field","name":{"kind":"Name","value":"keywords"}},{"kind":"Field","name":{"kind":"Name","value":"ratings"}},{"kind":"Field","name":{"kind":"Name","value":"reviews"}},{"kind":"Field","name":{"kind":"Name","value":"itemId"}},{"kind":"Field","name":{"kind":"Name","value":"warranty"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"ageMin"}},{"kind":"Field","name":{"kind":"Name","value":"ageMax"}},{"kind":"Field","name":{"kind":"Name","value":"ageUnit"}},{"kind":"Field","name":{"kind":"Name","value":"cgst"}},{"kind":"Field","name":{"kind":"Name","value":"sgst"}},{"kind":"Field","name":{"kind":"Name","value":"igst"}},{"kind":"Field","name":{"kind":"Name","value":"returnInfo"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"keyFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"expiryDate"}},{"kind":"Field","name":{"kind":"Name","value":"vendor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"businessName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"productDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"specifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"countryOfOrigin"}},{"kind":"Field","name":{"kind":"Name","value":"stock"}}]}},{"kind":"Field","name":{"kind":"Name","value":"trending"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"StringValue","value":"hot","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"store"},"value":{"kind":"Variable","name":{"kind":"Name","value":"store"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"barcode"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"productMasterId"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"foodType"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"mrp"}},{"kind":"Field","name":{"kind":"Name","value":"stock"}},{"kind":"Field","name":{"kind":"Name","value":"tax"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"imagesCdn"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"trending"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"hot"}},{"kind":"Field","name":{"kind":"Name","value":"new"}},{"kind":"Field","name":{"kind":"Name","value":"sale"}},{"kind":"Field","name":{"kind":"Name","value":"recommended"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"metaDescription"}},{"kind":"Field","name":{"kind":"Name","value":"keywords"}},{"kind":"Field","name":{"kind":"Name","value":"ratings"}},{"kind":"Field","name":{"kind":"Name","value":"reviews"}},{"kind":"Field","name":{"kind":"Name","value":"itemId"}},{"kind":"Field","name":{"kind":"Name","value":"warranty"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"ageMin"}},{"kind":"Field","name":{"kind":"Name","value":"ageMax"}},{"kind":"Field","name":{"kind":"Name","value":"ageUnit"}},{"kind":"Field","name":{"kind":"Name","value":"cgst"}},{"kind":"Field","name":{"kind":"Name","value":"sgst"}},{"kind":"Field","name":{"kind":"Name","value":"igst"}},{"kind":"Field","name":{"kind":"Name","value":"returnInfo"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"keyFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"expiryDate"}},{"kind":"Field","name":{"kind":"Name","value":"vendor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"businessName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"productDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"specifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"countryOfOrigin"}},{"kind":"Field","name":{"kind":"Name","value":"stock"}}]}},{"kind":"Field","name":{"kind":"Name","value":"popular"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"store"},"value":{"kind":"Variable","name":{"kind":"Name","value":"store"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"IntValue","value":"0"}},{"kind":"Argument","name":{"kind":"Name","value":"zip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"zip"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"mrp"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"stock"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"imagesCdn"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"ratings"}},{"kind":"Field","name":{"kind":"Name","value":"reviews"}},{"kind":"Field","name":{"kind":"Name","value":"zips"}},{"kind":"Field","name":{"kind":"Name","value":"foodType"}},{"kind":"Field","name":{"kind":"Name","value":"expiryDate"}},{"kind":"Field","name":{"kind":"Name","value":"vendor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"bannerCdn"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"page"}}]}},{"kind":"Field","name":{"kind":"Name","value":"groupByBanner"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"active"},"value":{"kind":"BooleanValue","value":true}},{"kind":"Argument","name":{"kind":"Name","value":"pageId"},"value":{"kind":"StringValue","value":"home","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"store"},"value":{"kind":"Variable","name":{"kind":"Name","value":"store"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"heading"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"pageId"}},{"kind":"Field","name":{"kind":"Name","value":"store"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"groupId"}},{"kind":"Field","name":{"kind":"Name","value":"groupTitle"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<HomeQuery, HomeQueryVariables>;
export const MyOrderItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"myOrderItems"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"store"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myOrderItems"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"store"},"value":{"kind":"Variable","name":{"kind":"Name","value":"store"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isReplacement"}},{"kind":"Field","name":{"kind":"Name","value":"pid"}},{"kind":"Field","name":{"kind":"Name","value":"usedOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"val"}},{"kind":"Field","name":{"kind":"Name","value":"dates"}}]}},{"kind":"Field","name":{"kind":"Name","value":"posInvoiceNo"}},{"kind":"Field","name":{"kind":"Name","value":"itemOrderNo"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"foodType"}},{"kind":"Field","name":{"kind":"Name","value":"tracking"}},{"kind":"Field","name":{"kind":"Name","value":"shippingCharge"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"qty"}},{"kind":"Field","name":{"kind":"Name","value":"tax"}},{"kind":"Field","name":{"kind":"Name","value":"brandName"}},{"kind":"Field","name":{"kind":"Name","value":"brandImg"}},{"kind":"Field","name":{"kind":"Name","value":"brandImgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"trackingId"}},{"kind":"Field","name":{"kind":"Name","value":"returnTrackingId"}},{"kind":"Field","name":{"kind":"Name","value":"courierName"}},{"kind":"Field","name":{"kind":"Name","value":"returnCourierName"}},{"kind":"Field","name":{"kind":"Name","value":"orderNo"}},{"kind":"Field","name":{"kind":"Name","value":"otp"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"paySuccess"}},{"kind":"Field","name":{"kind":"Name","value":"payment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paymentMode"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"paymentCurrency"}},{"kind":"Field","name":{"kind":"Name","value":"paymentReferenceId"}},{"kind":"Field","name":{"kind":"Name","value":"paymentOrderId"}},{"kind":"Field","name":{"kind":"Name","value":"paymentReceipt"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceId"}},{"kind":"Field","name":{"kind":"Name","value":"paymentGateway"}},{"kind":"Field","name":{"kind":"Name","value":"codPaid"}},{"kind":"Field","name":{"kind":"Name","value":"amountPaid"}},{"kind":"Field","name":{"kind":"Name","value":"amountDue"}},{"kind":"Field","name":{"kind":"Name","value":"paymentMsg"}},{"kind":"Field","name":{"kind":"Name","value":"paymentTime"}},{"kind":"Field","name":{"kind":"Name","value":"paid"}},{"kind":"Field","name":{"kind":"Name","value":"userFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"userLastName"}},{"kind":"Field","name":{"kind":"Name","value":"userPhone"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceLink"}},{"kind":"Field","name":{"kind":"Name","value":"returnValidTill"}},{"kind":"Field","name":{"kind":"Name","value":"paymentMode"}},{"kind":"Field","name":{"kind":"Name","value":"paymentAmount"}},{"kind":"Field","name":{"kind":"Name","value":"vendorBusinessName"}},{"kind":"Field","name":{"kind":"Name","value":"vendor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"bannerCdn"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}}]}},{"kind":"Field","name":{"kind":"Name","value":"amount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"qty"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"tax"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amountPaid"}},{"kind":"Field","name":{"kind":"Name","value":"amountDue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"store"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"orderHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"public"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}}]}}]}}]}}]} as unknown as DocumentNode<MyOrderItemsQuery, MyOrderItemsQueryVariables>;
export const MyOrdersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"myOrders"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"store"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myOrders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"store"},"value":{"kind":"Variable","name":{"kind":"Name","value":"store"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paySuccess"}},{"kind":"Field","name":{"kind":"Name","value":"orderNo"}},{"kind":"Field","name":{"kind":"Name","value":"otp"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"codPaid"}},{"kind":"Field","name":{"kind":"Name","value":"payment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amountPaid"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paymentMode"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"paymentCurrency"}},{"kind":"Field","name":{"kind":"Name","value":"paymentReferenceId"}},{"kind":"Field","name":{"kind":"Name","value":"paymentOrderId"}},{"kind":"Field","name":{"kind":"Name","value":"paymentReceipt"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceId"}},{"kind":"Field","name":{"kind":"Name","value":"paymentGateway"}},{"kind":"Field","name":{"kind":"Name","value":"codPaid"}},{"kind":"Field","name":{"kind":"Name","value":"amountPaid"}},{"kind":"Field","name":{"kind":"Name","value":"amountDue"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"paymentMsg"}},{"kind":"Field","name":{"kind":"Name","value":"paymentTime"}},{"kind":"Field","name":{"kind":"Name","value":"paid"}},{"kind":"Field","name":{"kind":"Name","value":"amount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"qty"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"tax"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"userLastName"}},{"kind":"Field","name":{"kind":"Name","value":"userPhone"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"town"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zip"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}}]}},{"kind":"Field","name":{"kind":"Name","value":"store"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pid"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"posInvoiceNo"}},{"kind":"Field","name":{"kind":"Name","value":"itemOrderNo"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"barcode"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"foodType"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"qty"}},{"kind":"Field","name":{"kind":"Name","value":"shippingCharge"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"tax"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"brandName"}},{"kind":"Field","name":{"kind":"Name","value":"brandImg"}},{"kind":"Field","name":{"kind":"Name","value":"brandImgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"vendorBusinessName"}},{"kind":"Field","name":{"kind":"Name","value":"vendor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"bannerCdn"}}]}},{"kind":"Field","name":{"kind":"Name","value":"orderStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"event"}},{"kind":"Field","name":{"kind":"Name","value":"tracking_id"}},{"kind":"Field","name":{"kind":"Name","value":"courier_name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"orderItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"pid"}},{"kind":"Field","name":{"kind":"Name","value":"posInvoiceNo"}},{"kind":"Field","name":{"kind":"Name","value":"itemOrderNo"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"qty"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"mrp"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"tracking"}},{"kind":"Field","name":{"kind":"Name","value":"shippingCharge"}},{"kind":"Field","name":{"kind":"Name","value":"tax"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"brandName"}},{"kind":"Field","name":{"kind":"Name","value":"brandImg"}},{"kind":"Field","name":{"kind":"Name","value":"brandImgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"foodType"}},{"kind":"Field","name":{"kind":"Name","value":"usedOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"val"}},{"kind":"Field","name":{"kind":"Name","value":"dates"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<MyOrdersQuery, MyOrdersQueryVariables>;
export const OrderItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"orderItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"pid"}},{"kind":"Field","name":{"kind":"Name","value":"usedOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"val"}},{"kind":"Field","name":{"kind":"Name","value":"dates"}}]}},{"kind":"Field","name":{"kind":"Name","value":"posInvoiceNo"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceId"}},{"kind":"Field","name":{"kind":"Name","value":"itemOrderNo"}},{"kind":"Field","name":{"kind":"Name","value":"expectedDeliveryDate"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryDetails"}},{"kind":"Field","name":{"kind":"Name","value":"shippingOrderId"}},{"kind":"Field","name":{"kind":"Name","value":"shippingProvider"}},{"kind":"Field","name":{"kind":"Name","value":"shippingLabelId"}},{"kind":"Field","name":{"kind":"Name","value":"shippingRateId"}},{"kind":"Field","name":{"kind":"Name","value":"shippingTrackingNumber"}},{"kind":"Field","name":{"kind":"Name","value":"shippingTrackingStatus"}},{"kind":"Field","name":{"kind":"Name","value":"shippingTrackingUrlProvider"}},{"kind":"Field","name":{"kind":"Name","value":"shippingLabelUrl"}},{"kind":"Field","name":{"kind":"Name","value":"shippingCommercialInvoiceUrl"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"tracking"}},{"kind":"Field","name":{"kind":"Name","value":"foodType"}},{"kind":"Field","name":{"kind":"Name","value":"shippingCharge"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"basePrice"}},{"kind":"Field","name":{"kind":"Name","value":"qty"}},{"kind":"Field","name":{"kind":"Name","value":"tax"}},{"kind":"Field","name":{"kind":"Name","value":"baseTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalDiscount"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"brandName"}},{"kind":"Field","name":{"kind":"Name","value":"brandImg"}},{"kind":"Field","name":{"kind":"Name","value":"brandImgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"trackingId"}},{"kind":"Field","name":{"kind":"Name","value":"returnTrackingId"}},{"kind":"Field","name":{"kind":"Name","value":"courierName"}},{"kind":"Field","name":{"kind":"Name","value":"returnCourierName"}},{"kind":"Field","name":{"kind":"Name","value":"replaceValidTill"}},{"kind":"Field","name":{"kind":"Name","value":"returnValidTill"}},{"kind":"Field","name":{"kind":"Name","value":"returnPolicyExpired"}},{"kind":"Field","name":{"kind":"Name","value":"returnReason"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"amountRefunded"}},{"kind":"Field","name":{"kind":"Name","value":"baseAmountRefunded"}},{"kind":"Field","name":{"kind":"Name","value":"refunds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"qty"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"refundId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"orderNo"}},{"kind":"Field","name":{"kind":"Name","value":"otp"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"paySuccess"}},{"kind":"Field","name":{"kind":"Name","value":"payment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paymentMode"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"paymentCurrency"}},{"kind":"Field","name":{"kind":"Name","value":"paymentReferenceId"}},{"kind":"Field","name":{"kind":"Name","value":"paymentOrderId"}},{"kind":"Field","name":{"kind":"Name","value":"paymentReceipt"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceId"}},{"kind":"Field","name":{"kind":"Name","value":"paymentGateway"}},{"kind":"Field","name":{"kind":"Name","value":"codPaid"}},{"kind":"Field","name":{"kind":"Name","value":"baseCodPaid"}},{"kind":"Field","name":{"kind":"Name","value":"amountPaid"}},{"kind":"Field","name":{"kind":"Name","value":"amountDue"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmountRefunded"}},{"kind":"Field","name":{"kind":"Name","value":"baseTotalAmountRefunded"}},{"kind":"Field","name":{"kind":"Name","value":"paymentMsg"}},{"kind":"Field","name":{"kind":"Name","value":"paymentTime"}},{"kind":"Field","name":{"kind":"Name","value":"paid"}},{"kind":"Field","name":{"kind":"Name","value":"userFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"userLastName"}},{"kind":"Field","name":{"kind":"Name","value":"userPhone"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceLink"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"baseDiscount"}},{"kind":"Field","name":{"kind":"Name","value":"totalDiscount"}},{"kind":"Field","name":{"kind":"Name","value":"baseTotalDiscount"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"amount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"totalDiscount"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"baseAmount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"totalDiscount"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"town"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zip"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}}]}},{"kind":"Field","name":{"kind":"Name","value":"store"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"slot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"info"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vendor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"bannerCdn"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vendorBusinessName"}},{"kind":"Field","name":{"kind":"Name","value":"vendorPhone"}},{"kind":"Field","name":{"kind":"Name","value":"vendorEmail"}},{"kind":"Field","name":{"kind":"Name","value":"vendorCommissionType"}},{"kind":"Field","name":{"kind":"Name","value":"vendorCommissionValue"}},{"kind":"Field","name":{"kind":"Name","value":"vendorAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"town"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zip"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}}]}},{"kind":"Field","name":{"kind":"Name","value":"formattedSubtotal"}},{"kind":"Field","name":{"kind":"Name","value":"formattedShippingCharge"}},{"kind":"Field","name":{"kind":"Name","value":"formattedMrp"}},{"kind":"Field","name":{"kind":"Name","value":"formattedAmountRefunded"}},{"kind":"Field","name":{"kind":"Name","value":"formattedPrice"}},{"kind":"Field","name":{"kind":"Name","value":"formattedTax"}},{"kind":"Field","name":{"kind":"Name","value":"formattedTotal"}},{"kind":"Field","name":{"kind":"Name","value":"formattedTotalDiscount"}},{"kind":"Field","name":{"kind":"Name","value":"formattedVendorCommission"}},{"kind":"Field","name":{"kind":"Name","value":"formattedAmountDue"}},{"kind":"Field","name":{"kind":"Name","value":"formattedAmountPaid"}},{"kind":"Field","name":{"kind":"Name","value":"formattedCodPaid"}},{"kind":"Field","name":{"kind":"Name","value":"formattedDiscount"}},{"kind":"Field","name":{"kind":"Name","value":"formattedPaymentAmount"}},{"kind":"Field","name":{"kind":"Name","value":"formattedTotalAmountRefunded"}},{"kind":"Field","name":{"kind":"Name","value":"formattedAmount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"tax"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalDiscount"}},{"kind":"Field","name":{"kind":"Name","value":"exchangeRate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"orderHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"public"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}}]}}]}}]} as unknown as DocumentNode<OrderItemQuery, OrderItemQueryVariables>;
export const PaySuccessPageHitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"paySuccessPageHit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paymentReferenceId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paySuccessPageHit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}},{"kind":"Argument","name":{"kind":"Name","value":"paymentReferenceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paymentReferenceId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderNo"}},{"kind":"Field","name":{"kind":"Name","value":"otp"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"paySuccess"}},{"kind":"Field","name":{"kind":"Name","value":"paymentMode"}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"paymentCurrency"}},{"kind":"Field","name":{"kind":"Name","value":"paymentReferenceId"}},{"kind":"Field","name":{"kind":"Name","value":"paymentOrderId"}},{"kind":"Field","name":{"kind":"Name","value":"paymentReceipt"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceId"}},{"kind":"Field","name":{"kind":"Name","value":"paymentGateway"}},{"kind":"Field","name":{"kind":"Name","value":"codPaid"}},{"kind":"Field","name":{"kind":"Name","value":"baseCodPaid"}},{"kind":"Field","name":{"kind":"Name","value":"amountPaid"}},{"kind":"Field","name":{"kind":"Name","value":"amountDue"}},{"kind":"Field","name":{"kind":"Name","value":"paymentMsg"}},{"kind":"Field","name":{"kind":"Name","value":"paymentTime"}},{"kind":"Field","name":{"kind":"Name","value":"paid"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmountRefunded"}},{"kind":"Field","name":{"kind":"Name","value":"baseTotalAmountRefunded"}},{"kind":"Field","name":{"kind":"Name","value":"amount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"qty"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"tax"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}}]}},{"kind":"Field","name":{"kind":"Name","value":"baseAmount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"qty"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"tax"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userFirstName"}},{"kind":"Field","name":{"kind":"Name","value":"userLastName"}},{"kind":"Field","name":{"kind":"Name","value":"userPhone"}},{"kind":"Field","name":{"kind":"Name","value":"userEmail"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"town"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zip"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pid"}},{"kind":"Field","name":{"kind":"Name","value":"posInvoiceNo"}},{"kind":"Field","name":{"kind":"Name","value":"itemOrderNo"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"barcode"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"foodType"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"basePrice"}},{"kind":"Field","name":{"kind":"Name","value":"qty"}},{"kind":"Field","name":{"kind":"Name","value":"shippingCharge"}},{"kind":"Field","name":{"kind":"Name","value":"baseShippingCharge"}},{"kind":"Field","name":{"kind":"Name","value":"tax"}},{"kind":"Field","name":{"kind":"Name","value":"baseTax"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"usedOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"val"}},{"kind":"Field","name":{"kind":"Name","value":"dates"}}]}},{"kind":"Field","name":{"kind":"Name","value":"brandName"}},{"kind":"Field","name":{"kind":"Name","value":"brandImg"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"returnReason"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"amountRefunded"}},{"kind":"Field","name":{"kind":"Name","value":"baseAmountRefunded"}},{"kind":"Field","name":{"kind":"Name","value":"vendorBusinessName"}},{"kind":"Field","name":{"kind":"Name","value":"vendorAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"town"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zip"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}}]}},{"kind":"Field","name":{"kind":"Name","value":"orderHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"public"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}}]}}]}}]}}]} as unknown as DocumentNode<PaySuccessPageHitMutation, PaySuccessPageHitMutationVariables>;
export const CashfreePayNowNewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"cashfreePayNowNew"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"address"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slot"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cashfreePayNowNew"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"address"}}},{"kind":"Argument","name":{"kind":"Name","value":"slot"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slot"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderId"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"redirectUrl"}}]}}]}}]} as unknown as DocumentNode<CashfreePayNowNewMutation, CashfreePayNowNewMutationVariables>;
export const DeletePaymentMethodDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deletePaymentMethod"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePaymentMethod"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeletePaymentMethodMutation, DeletePaymentMethodMutationVariables>;
export const PaymentMethodDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"paymentMethod"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paymentMethod"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"qrcode"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"instructions"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"isError"}}]}}]}}]} as unknown as DocumentNode<PaymentMethodQuery, PaymentMethodQueryVariables>;
export const PaymentMethodsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"paymentMethods"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"store"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"active"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paymentMethods"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"active"},"value":{"kind":"Variable","name":{"kind":"Name","value":"active"}}},{"kind":"Argument","name":{"kind":"Name","value":"store"},"value":{"kind":"Variable","name":{"kind":"Name","value":"store"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"qrcode"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"instructions"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}}]}}]} as unknown as DocumentNode<PaymentMethodsQuery, PaymentMethodsQueryVariables>;
export const PaymentMethodsAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"paymentMethodsAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"active"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"store"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paymentMethodsAdmin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"active"},"value":{"kind":"Variable","name":{"kind":"Name","value":"active"}}},{"kind":"Argument","name":{"kind":"Name","value":"store"},"value":{"kind":"Variable","name":{"kind":"Name","value":"store"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"qrcode"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"instructions"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"isError"}}]}}]}}]}}]} as unknown as DocumentNode<PaymentMethodsAdminQuery, PaymentMethodsAdminQueryVariables>;
export const SavePaymentMethodDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"savePaymentMethod"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"value"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"color"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"img"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"qrcode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"instructions"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"position"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"active"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"savePaymentMethod"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"value"},"value":{"kind":"Variable","name":{"kind":"Name","value":"value"}}},{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}},{"kind":"Argument","name":{"kind":"Name","value":"color"},"value":{"kind":"Variable","name":{"kind":"Name","value":"color"}}},{"kind":"Argument","name":{"kind":"Name","value":"img"},"value":{"kind":"Variable","name":{"kind":"Name","value":"img"}}},{"kind":"Argument","name":{"kind":"Name","value":"qrcode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"qrcode"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}},{"kind":"Argument","name":{"kind":"Name","value":"instructions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"instructions"}}},{"kind":"Argument","name":{"kind":"Name","value":"position"},"value":{"kind":"Variable","name":{"kind":"Name","value":"position"}}},{"kind":"Argument","name":{"kind":"Name","value":"active"},"value":{"kind":"Variable","name":{"kind":"Name","value":"active"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"qrcode"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"instructions"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}}]} as unknown as DocumentNode<SavePaymentMethodMutation, SavePaymentMethodMutationVariables>;
export const StripeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"stripe"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"address"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paymentMethodId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slot"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stripe"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"address"}}},{"kind":"Argument","name":{"kind":"Name","value":"paymentMethodId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paymentMethodId"}}},{"kind":"Argument","name":{"kind":"Name","value":"slot"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slot"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"paymentOrderId"}},{"kind":"Field","name":{"kind":"Name","value":"paymentMode"}},{"kind":"Field","name":{"kind":"Name","value":"paymentGateway"}},{"kind":"Field","name":{"kind":"Name","value":"referenceId"}},{"kind":"Field","name":{"kind":"Name","value":"txMsg"}},{"kind":"Field","name":{"kind":"Name","value":"txTime"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceId"}},{"kind":"Field","name":{"kind":"Name","value":"receipt"}},{"kind":"Field","name":{"kind":"Name","value":"paid"}},{"kind":"Field","name":{"kind":"Name","value":"amountPaid"}},{"kind":"Field","name":{"kind":"Name","value":"amountDue"}},{"kind":"Field","name":{"kind":"Name","value":"amountRefunded"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"captured"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"orderId"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"refundStatus"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"contact"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"tax"}},{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"errorDescription"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"clientSecret"}},{"kind":"Field","name":{"kind":"Name","value":"approvalUrl"}}]}}]}}]} as unknown as DocumentNode<StripeMutation, StripeMutationVariables>;
export const ProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"product"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"zip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"optionValues"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"zip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"zip"}}},{"kind":"Argument","name":{"kind":"Name","value":"optionValues"},"value":{"kind":"Variable","name":{"kind":"Name","value":"optionValues"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"mrp"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"stock"}},{"kind":"Field","name":{"kind":"Name","value":"trackInventory"}},{"kind":"Field","name":{"kind":"Name","value":"tax"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"imagesCdn"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"ratings"}},{"kind":"Field","name":{"kind":"Name","value":"reviews"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"hsn"}},{"kind":"Field","name":{"kind":"Name","value":"group"}},{"kind":"Field","name":{"kind":"Name","value":"barcode"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"gtin"}},{"kind":"Field","name":{"kind":"Name","value":"condition"}},{"kind":"Field","name":{"kind":"Name","value":"trending"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"hot"}},{"kind":"Field","name":{"kind":"Name","value":"new"}},{"kind":"Field","name":{"kind":"Name","value":"sale"}},{"kind":"Field","name":{"kind":"Name","value":"recommended"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"itemId"}},{"kind":"Field","name":{"kind":"Name","value":"warranty"}},{"kind":"Field","name":{"kind":"Name","value":"metaDescription"}},{"kind":"Field","name":{"kind":"Name","value":"keywords"}},{"kind":"Field","name":{"kind":"Name","value":"keywordsA"}},{"kind":"Field","name":{"kind":"Name","value":"ageMin"}},{"kind":"Field","name":{"kind":"Name","value":"ageMax"}},{"kind":"Field","name":{"kind":"Name","value":"ageUnit"}},{"kind":"Field","name":{"kind":"Name","value":"styleCode"}},{"kind":"Field","name":{"kind":"Name","value":"eanNo"}},{"kind":"Field","name":{"kind":"Name","value":"articleCode"}},{"kind":"Field","name":{"kind":"Name","value":"productMasterId"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"manufacturer"}},{"kind":"Field","name":{"kind":"Name","value":"countryOfOrigin"}},{"kind":"Field","name":{"kind":"Name","value":"returnInfo"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"condition"}},{"kind":"Field","name":{"kind":"Name","value":"gtin"}},{"kind":"Field","name":{"kind":"Name","value":"cgst"}},{"kind":"Field","name":{"kind":"Name","value":"sgst"}},{"kind":"Field","name":{"kind":"Name","value":"igst"}},{"kind":"Field","name":{"kind":"Name","value":"sizechart"}},{"kind":"Field","name":{"kind":"Name","value":"batchNo"}},{"kind":"Field","name":{"kind":"Name","value":"mfgDate"}},{"kind":"Field","name":{"kind":"Name","value":"expired"}},{"kind":"Field","name":{"kind":"Name","value":"expiryDate"}},{"kind":"Field","name":{"kind":"Name","value":"isSearchable"}},{"kind":"Field","name":{"kind":"Name","value":"isUnlimited"}},{"kind":"Field","name":{"kind":"Name","value":"totalSold"}},{"kind":"Field","name":{"kind":"Name","value":"preOrder"}},{"kind":"Field","name":{"kind":"Name","value":"zips"}},{"kind":"Field","name":{"kind":"Name","value":"foodType"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryDetails"}},{"kind":"Field","name":{"kind":"Name","value":"slots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"country"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sizeGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"size"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"colorGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"color"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color_code"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"brand"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parentBrand"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"color"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"size"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"pathA"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categoryPool"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"keyFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"features"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"specifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"productDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"scheduleDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"collections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"q"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"inputType"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"preselectDefault"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"default"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"direction"}},{"kind":"Field","name":{"kind":"Name","value":"isPercent"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"vendor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"bannerCdn"}},{"kind":"Field","name":{"kind":"Name","value":"ratings"}},{"kind":"Field","name":{"kind":"Name","value":"reviews"}},{"kind":"Field","name":{"kind":"Name","value":"info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"store"}},{"kind":"Field","name":{"kind":"Name","value":"public"}},{"kind":"Field","name":{"kind":"Name","value":"storePhotos"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"relatedProducts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"img"}}]}},{"kind":"Field","name":{"kind":"Name","value":"returnInfo"}},{"kind":"Field","name":{"kind":"Name","value":"returnAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"replaceAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"returnValidityInDays"}},{"kind":"Field","name":{"kind":"Name","value":"replaceValidityInDays"}},{"kind":"Field","name":{"kind":"Name","value":"files"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"dimensionUnit"}},{"kind":"Field","name":{"kind":"Name","value":"formattedMrp"}},{"kind":"Field","name":{"kind":"Name","value":"formattedPrice"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<ProductQuery, ProductQueryVariables>;
export const ProductSlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"productSlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productSlug"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"metaDescription"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"hsn"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"imagesCdn"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"mrp"}},{"kind":"Field","name":{"kind":"Name","value":"formattedPrice"}},{"kind":"Field","name":{"kind":"Name","value":"formattedMrp"}},{"kind":"Field","name":{"kind":"Name","value":"stock"}},{"kind":"Field","name":{"kind":"Name","value":"isUnlimited"}},{"kind":"Field","name":{"kind":"Name","value":"trackInventory"}},{"kind":"Field","name":{"kind":"Name","value":"ratings"}},{"kind":"Field","name":{"kind":"Name","value":"reviews"}},{"kind":"Field","name":{"kind":"Name","value":"returnInfo"}},{"kind":"Field","name":{"kind":"Name","value":"replaceValidityInDays"}},{"kind":"Field","name":{"kind":"Name","value":"returnAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"replaceValidityInDays"}},{"kind":"Field","name":{"kind":"Name","value":"replaceAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"color"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"size"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"brand"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vendor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"bannerCdn"}},{"kind":"Field","name":{"kind":"Name","value":"ratings"}},{"kind":"Field","name":{"kind":"Name","value":"reviews"}},{"kind":"Field","name":{"kind":"Name","value":"info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"store"}},{"kind":"Field","name":{"kind":"Name","value":"public"}},{"kind":"Field","name":{"kind":"Name","value":"storePhotos"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ProductSlugQuery, ProductSlugQueryVariables>;
export const ProductsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"products"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sku"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"brand"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"price"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"vendor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"category"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"active"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"featured"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"new"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hot"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sale"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"store"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"types"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"sku"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sku"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"brand"},"value":{"kind":"Variable","name":{"kind":"Name","value":"brand"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"price"},"value":{"kind":"Variable","name":{"kind":"Name","value":"price"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"vendor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"vendor"}}},{"kind":"Argument","name":{"kind":"Name","value":"category"},"value":{"kind":"Variable","name":{"kind":"Name","value":"category"}}},{"kind":"Argument","name":{"kind":"Name","value":"active"},"value":{"kind":"Variable","name":{"kind":"Name","value":"active"}}},{"kind":"Argument","name":{"kind":"Name","value":"featured"},"value":{"kind":"Variable","name":{"kind":"Name","value":"featured"}}},{"kind":"Argument","name":{"kind":"Name","value":"new"},"value":{"kind":"Variable","name":{"kind":"Name","value":"new"}}},{"kind":"Argument","name":{"kind":"Name","value":"hot"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hot"}}},{"kind":"Argument","name":{"kind":"Name","value":"sale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sale"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"store"},"value":{"kind":"Variable","name":{"kind":"Name","value":"store"}}},{"kind":"Argument","name":{"kind":"Name","value":"types"},"value":{"kind":"Variable","name":{"kind":"Name","value":"types"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"noOfPage"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"barcode"}},{"kind":"Field","name":{"kind":"Name","value":"productMasterId"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"mrp"}},{"kind":"Field","name":{"kind":"Name","value":"stock"}},{"kind":"Field","name":{"kind":"Name","value":"trackInventory"}},{"kind":"Field","name":{"kind":"Name","value":"tax"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"imagesCdn"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"trending"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"hot"}},{"kind":"Field","name":{"kind":"Name","value":"new"}},{"kind":"Field","name":{"kind":"Name","value":"sale"}},{"kind":"Field","name":{"kind":"Name","value":"recommended"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"metaDescription"}},{"kind":"Field","name":{"kind":"Name","value":"keywords"}},{"kind":"Field","name":{"kind":"Name","value":"keywordsA"}},{"kind":"Field","name":{"kind":"Name","value":"ratings"}},{"kind":"Field","name":{"kind":"Name","value":"reviews"}},{"kind":"Field","name":{"kind":"Name","value":"itemId"}},{"kind":"Field","name":{"kind":"Name","value":"warranty"}},{"kind":"Field","name":{"kind":"Name","value":"ageMin"}},{"kind":"Field","name":{"kind":"Name","value":"ageMax"}},{"kind":"Field","name":{"kind":"Name","value":"ageUnit"}},{"kind":"Field","name":{"kind":"Name","value":"cgst"}},{"kind":"Field","name":{"kind":"Name","value":"sgst"}},{"kind":"Field","name":{"kind":"Name","value":"igst"}},{"kind":"Field","name":{"kind":"Name","value":"returnInfo"}},{"kind":"Field","name":{"kind":"Name","value":"returnAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"replaceAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"returnValidityInDays"}},{"kind":"Field","name":{"kind":"Name","value":"sizechart"}},{"kind":"Field","name":{"kind":"Name","value":"batchNo"}},{"kind":"Field","name":{"kind":"Name","value":"mfgDate"}},{"kind":"Field","name":{"kind":"Name","value":"expired"}},{"kind":"Field","name":{"kind":"Name","value":"expiryDate"}},{"kind":"Field","name":{"kind":"Name","value":"isSearchable"}},{"kind":"Field","name":{"kind":"Name","value":"isUnlimited"}},{"kind":"Field","name":{"kind":"Name","value":"totalSold"}},{"kind":"Field","name":{"kind":"Name","value":"preOrder"}},{"kind":"Field","name":{"kind":"Name","value":"zips"}},{"kind":"Field","name":{"kind":"Name","value":"foodType"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryDetails"}},{"kind":"Field","name":{"kind":"Name","value":"formattedMrp"}},{"kind":"Field","name":{"kind":"Name","value":"formattedPrice"}},{"kind":"Field","name":{"kind":"Name","value":"slots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"store"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vendor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"bannerCdn"}},{"kind":"Field","name":{"kind":"Name","value":"ratings"}},{"kind":"Field","name":{"kind":"Name","value":"reviews"}},{"kind":"Field","name":{"kind":"Name","value":"info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"store"}},{"kind":"Field","name":{"kind":"Name","value":"public"}},{"kind":"Field","name":{"kind":"Name","value":"storePhotos"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<ProductsQuery, ProductsQueryVariables>;
export const ProductReviewsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"productReviews"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"active"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productReviews"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"pid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pid"}}},{"kind":"Argument","name":{"kind":"Name","value":"active"},"value":{"kind":"Variable","name":{"kind":"Name","value":"active"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}}]}}]} as unknown as DocumentNode<ProductReviewsQuery, ProductReviewsQueryVariables>;
export const ReviewsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"reviews"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"store"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reviews"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"store"},"value":{"kind":"Variable","name":{"kind":"Name","value":"store"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"pid"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vendor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"bannerCdn"}}]}},{"kind":"Field","name":{"kind":"Name","value":"store"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ReviewsQuery, ReviewsQueryVariables>;
export const PopularSearchesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"popularSearches"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"store"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"domain"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"popularSearches"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"store"},"value":{"kind":"Variable","name":{"kind":"Name","value":"store"}}},{"kind":"Argument","name":{"kind":"Name","value":"domain"},"value":{"kind":"Variable","name":{"kind":"Name","value":"domain"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"store"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]}}]}}]} as unknown as DocumentNode<PopularSearchesQuery, PopularSearchesQueryVariables>;
export const SettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"websiteName"}},{"kind":"Field","name":{"kind":"Name","value":"websiteLegalName"}},{"kind":"Field","name":{"kind":"Name","value":"liveCommerce"}},{"kind":"Field","name":{"kind":"Name","value":"multilingual"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"closedMessage"}},{"kind":"Field","name":{"kind":"Name","value":"minimumOrderValue"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"alert"}},{"kind":"Field","name":{"kind":"Name","value":"keywords"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cgst"}},{"kind":"Field","name":{"kind":"Name","value":"sgst"}},{"kind":"Field","name":{"kind":"Name","value":"igst"}}]}},{"kind":"Field","name":{"kind":"Name","value":"demo"}},{"kind":"Field","name":{"kind":"Name","value":"RAZORPAY_KEY_ID"}},{"kind":"Field","name":{"kind":"Name","value":"GOOGLE_CLIENT_ID"}},{"kind":"Field","name":{"kind":"Name","value":"stripePublishableKey"}},{"kind":"Field","name":{"kind":"Name","value":"brainTreePublicKey"}},{"kind":"Field","name":{"kind":"Name","value":"enableStripe"}},{"kind":"Field","name":{"kind":"Name","value":"enableSubsription"}},{"kind":"Field","name":{"kind":"Name","value":"enableRazorpay"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"currencySymbol"}},{"kind":"Field","name":{"kind":"Name","value":"currencyDecimals"}},{"kind":"Field","name":{"kind":"Name","value":"openGraphImage"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deliveryDays"}},{"kind":"Field","name":{"kind":"Name","value":"charge"}},{"kind":"Field","name":{"kind":"Name","value":"free"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userRoles"}},{"kind":"Field","name":{"kind":"Name","value":"websiteEmail"}},{"kind":"Field","name":{"kind":"Name","value":"shopPhone"}},{"kind":"Field","name":{"kind":"Name","value":"shopAddress"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"countryDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"dialCode"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"flag"}},{"kind":"Field","name":{"kind":"Name","value":"lang"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"currencyDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isoCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lang"}},{"kind":"Field","name":{"kind":"Name","value":"langDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nativeName"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"logoMobile"}},{"kind":"Field","name":{"kind":"Name","value":"logoDark"}},{"kind":"Field","name":{"kind":"Name","value":"logoMobileDark"}},{"kind":"Field","name":{"kind":"Name","value":"favicon"}},{"kind":"Field","name":{"kind":"Name","value":"CDN_URL"}},{"kind":"Field","name":{"kind":"Name","value":"S3_URL"}},{"kind":"Field","name":{"kind":"Name","value":"LIVE_COMMERCE_URL"}},{"kind":"Field","name":{"kind":"Name","value":"searchbarText"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"returnReasons"}},{"kind":"Field","name":{"kind":"Name","value":"orderStatuses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"public"}},{"kind":"Field","name":{"kind":"Name","value":"index"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paymentStatuses"}},{"kind":"Field","name":{"kind":"Name","value":"paymentMethods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"Field","name":{"kind":"Name","value":"otpLogin"}},{"kind":"Field","name":{"kind":"Name","value":"sms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"AUTO_VERIFICATION_ID"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}}]}},{"kind":"Field","name":{"kind":"Name","value":"email"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"cc"}},{"kind":"Field","name":{"kind":"Name","value":"bcc"}},{"kind":"Field","name":{"kind":"Name","value":"printers"}}]}},{"kind":"Field","name":{"kind":"Name","value":"storage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}}]}},{"kind":"Field","name":{"kind":"Name","value":"review"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"moderate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moderate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customerOrderNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderConfirmation"}},{"kind":"Field","name":{"kind":"Name","value":"orderStatusChanged"}},{"kind":"Field","name":{"kind":"Name","value":"orderShipped"}},{"kind":"Field","name":{"kind":"Name","value":"orderIsReadyForPickup"}},{"kind":"Field","name":{"kind":"Name","value":"downloadEGoods"}},{"kind":"Field","name":{"kind":"Name","value":"giftCardPurchased"}}]}},{"kind":"Field","name":{"kind":"Name","value":"adminNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newOrderPlaced"}},{"kind":"Field","name":{"kind":"Name","value":"lowStockNotification"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ADMIN_PANEL_LINK"}},{"kind":"Field","name":{"kind":"Name","value":"DOCS_LINK"}},{"kind":"Field","name":{"kind":"Name","value":"storageProvider"}},{"kind":"Field","name":{"kind":"Name","value":"googleMapsApi"}},{"kind":"Field","name":{"kind":"Name","value":"facebook"}},{"kind":"Field","name":{"kind":"Name","value":"twitter"}},{"kind":"Field","name":{"kind":"Name","value":"google"}},{"kind":"Field","name":{"kind":"Name","value":"instagram"}},{"kind":"Field","name":{"kind":"Name","value":"linkedin"}},{"kind":"Field","name":{"kind":"Name","value":"enableTax"}},{"kind":"Field","name":{"kind":"Name","value":"locationExpiry"}},{"kind":"Field","name":{"kind":"Name","value":"WWW_URL"}},{"kind":"Field","name":{"kind":"Name","value":"referralBonus"}},{"kind":"Field","name":{"kind":"Name","value":"joiningBonus"}},{"kind":"Field","name":{"kind":"Name","value":"isMultiVendor"}},{"kind":"Field","name":{"kind":"Name","value":"isMultiStore"}},{"kind":"Field","name":{"kind":"Name","value":"isMegamenu"}},{"kind":"Field","name":{"kind":"Name","value":"isSaas"}},{"kind":"Field","name":{"kind":"Name","value":"isSearch"}},{"kind":"Field","name":{"kind":"Name","value":"foodTypes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"val"}},{"kind":"Field","name":{"kind":"Name","value":"img"}}]}}]}}]}}]} as unknown as DocumentNode<SettingsQuery, SettingsQueryVariables>;
export const StatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"states"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"country"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"countryCode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"states"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"country"},"value":{"kind":"Variable","name":{"kind":"Name","value":"country"}}},{"kind":"Argument","name":{"kind":"Name","value":"countryCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"countryCode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"flag"}},{"kind":"Field","name":{"kind":"Name","value":"lang"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<StatesQuery, StatesQueryVariables>;
export const StoreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"store"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"store"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"adminNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lowStockNotification"}},{"kind":"Field","name":{"kind":"Name","value":"newOrderPlaced"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"alert"}},{"kind":"Field","name":{"kind":"Name","value":"analyticsTrackingId"}},{"kind":"Field","name":{"kind":"Name","value":"banners"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"closedMessage"}},{"kind":"Field","name":{"kind":"Name","value":"customerOrderNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"downloadEGoods"}},{"kind":"Field","name":{"kind":"Name","value":"giftCardPurchased"}},{"kind":"Field","name":{"kind":"Name","value":"orderConfirmation"}},{"kind":"Field","name":{"kind":"Name","value":"orderIsReadyForPickup"}},{"kind":"Field","name":{"kind":"Name","value":"orderShipped"}},{"kind":"Field","name":{"kind":"Name","value":"orderStatusChanged"}},{"kind":"Field","name":{"kind":"Name","value":"orderConfirmationSms"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vendorNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderConfirmationSms"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"metaDescription"}},{"kind":"Field","name":{"kind":"Name","value":"dimentionUnit"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"facebook"}},{"kind":"Field","name":{"kind":"Name","value":"facebookPixelId"}},{"kind":"Field","name":{"kind":"Name","value":"facebookUrl"}},{"kind":"Field","name":{"kind":"Name","value":"favicon"}},{"kind":"Field","name":{"kind":"Name","value":"faviconCdn"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"freeShippingOn"}},{"kind":"Field","name":{"kind":"Name","value":"gdpr"}},{"kind":"Field","name":{"kind":"Name","value":"gdprCookieConsent"}},{"kind":"Field","name":{"kind":"Name","value":"google"}},{"kind":"Field","name":{"kind":"Name","value":"googleAdsTag"}},{"kind":"Field","name":{"kind":"Name","value":"homeMeta1"}},{"kind":"Field","name":{"kind":"Name","value":"homeMeta2"}},{"kind":"Field","name":{"kind":"Name","value":"homeMeta3"}},{"kind":"Field","name":{"kind":"Name","value":"homeMeta4"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"imagesCdn"}},{"kind":"Field","name":{"kind":"Name","value":"instagram"}},{"kind":"Field","name":{"kind":"Name","value":"instagramUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isHideNilStock"}},{"kind":"Field","name":{"kind":"Name","value":"isMegamenu"}},{"kind":"Field","name":{"kind":"Name","value":"isOpen"}},{"kind":"Field","name":{"kind":"Name","value":"isSearch"}},{"kind":"Field","name":{"kind":"Name","value":"isHyperlocal"}},{"kind":"Field","name":{"kind":"Name","value":"isFnb"}},{"kind":"Field","name":{"kind":"Name","value":"isWishlist"}},{"kind":"Field","name":{"kind":"Name","value":"isCart"}},{"kind":"Field","name":{"kind":"Name","value":"keywords"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"legalName"}},{"kind":"Field","name":{"kind":"Name","value":"linkedin"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}},{"kind":"Field","name":{"kind":"Name","value":"locality"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"logoDark"}},{"kind":"Field","name":{"kind":"Name","value":"logoMobile"}},{"kind":"Field","name":{"kind":"Name","value":"logoMobileDark"}},{"kind":"Field","name":{"kind":"Name","value":"logoCdn"}},{"kind":"Field","name":{"kind":"Name","value":"logoDarkCdn"}},{"kind":"Field","name":{"kind":"Name","value":"logoMobileCdn"}},{"kind":"Field","name":{"kind":"Name","value":"logoMobileDarkCdn"}},{"kind":"Field","name":{"kind":"Name","value":"minimumOrderValue"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"openGraphImage"}},{"kind":"Field","name":{"kind":"Name","value":"openGraphImageCdn"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"pinterestTag"}},{"kind":"Field","name":{"kind":"Name","value":"pinterestUrl"}},{"kind":"Field","name":{"kind":"Name","value":"qrCode"}},{"kind":"Field","name":{"kind":"Name","value":"review"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"moderate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"searchbarText"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"charge"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryDays"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"free"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingCharge"}},{"kind":"Field","name":{"kind":"Name","value":"shopAddress"}},{"kind":"Field","name":{"kind":"Name","value":"shopPhone"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"snapChatPixel"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"bankAccountNo"}},{"kind":"Field","name":{"kind":"Name","value":"bankAccountHolderName"}},{"kind":"Field","name":{"kind":"Name","value":"bankIfscCode"}},{"kind":"Field","name":{"kind":"Name","value":"bankSwiftCode"}},{"kind":"Field","name":{"kind":"Name","value":"timeZone"}},{"kind":"Field","name":{"kind":"Name","value":"timing"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"twitter"}},{"kind":"Field","name":{"kind":"Name","value":"twitterUrl"}},{"kind":"Field","name":{"kind":"Name","value":"websiteEmail"}},{"kind":"Field","name":{"kind":"Name","value":"websiteLegalName"}},{"kind":"Field","name":{"kind":"Name","value":"websiteName"}},{"kind":"Field","name":{"kind":"Name","value":"weightUnit"}},{"kind":"Field","name":{"kind":"Name","value":"youtubeUrl"}},{"kind":"Field","name":{"kind":"Name","value":"webmail"}},{"kind":"Field","name":{"kind":"Name","value":"zip"}},{"kind":"Field","name":{"kind":"Name","value":"timeDisplayFormat"}},{"kind":"Field","name":{"kind":"Name","value":"priceDisplayFormat"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"}},{"kind":"Field","name":{"kind":"Name","value":"sms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"AUTO_VERIFICATION_ID"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippoToken"}},{"kind":"Field","name":{"kind":"Name","value":"shipRocketEmail"}},{"kind":"Field","name":{"kind":"Name","value":"shipRocketPassword"}},{"kind":"Field","name":{"kind":"Name","value":"shipRocketChannelId"}},{"kind":"Field","name":{"kind":"Name","value":"pickrrAuthToken"}},{"kind":"Field","name":{"kind":"Name","value":"storeTiming"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"day"}},{"kind":"Field","name":{"kind":"Name","value":"fromTime"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"isOpen"}},{"kind":"Field","name":{"kind":"Name","value":"online"}},{"kind":"Field","name":{"kind":"Name","value":"toTime"}}]}}]}}]}}]} as unknown as DocumentNode<StoreQuery, StoreQueryVariables>;
export const StoreOneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"storeOne"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"domain"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storeOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}},{"kind":"Argument","name":{"kind":"Name","value":"domain"},"value":{"kind":"Variable","name":{"kind":"Name","value":"domain"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"adminNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lowStockNotification"}},{"kind":"Field","name":{"kind":"Name","value":"newOrderPlaced"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"alert"}},{"kind":"Field","name":{"kind":"Name","value":"analyticsTrackingId"}},{"kind":"Field","name":{"kind":"Name","value":"banners"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"isWishlist"}},{"kind":"Field","name":{"kind":"Name","value":"isCart"}},{"kind":"Field","name":{"kind":"Name","value":"closedMessage"}},{"kind":"Field","name":{"kind":"Name","value":"customerOrderNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"downloadEGoods"}},{"kind":"Field","name":{"kind":"Name","value":"giftCardPurchased"}},{"kind":"Field","name":{"kind":"Name","value":"orderConfirmation"}},{"kind":"Field","name":{"kind":"Name","value":"orderIsReadyForPickup"}},{"kind":"Field","name":{"kind":"Name","value":"orderShipped"}},{"kind":"Field","name":{"kind":"Name","value":"orderStatusChanged"}},{"kind":"Field","name":{"kind":"Name","value":"orderConfirmationSms"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vendorNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderConfirmationSms"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"metaDescription"}},{"kind":"Field","name":{"kind":"Name","value":"dimentionUnit"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"facebook"}},{"kind":"Field","name":{"kind":"Name","value":"facebookPixelId"}},{"kind":"Field","name":{"kind":"Name","value":"facebookUrl"}},{"kind":"Field","name":{"kind":"Name","value":"favicon"}},{"kind":"Field","name":{"kind":"Name","value":"faviconCdn"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"freeShippingOn"}},{"kind":"Field","name":{"kind":"Name","value":"gdpr"}},{"kind":"Field","name":{"kind":"Name","value":"gdprCookieConsent"}},{"kind":"Field","name":{"kind":"Name","value":"google"}},{"kind":"Field","name":{"kind":"Name","value":"googleAdsTag"}},{"kind":"Field","name":{"kind":"Name","value":"homeMeta1"}},{"kind":"Field","name":{"kind":"Name","value":"homeMeta2"}},{"kind":"Field","name":{"kind":"Name","value":"homeMeta3"}},{"kind":"Field","name":{"kind":"Name","value":"homeMeta4"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"imagesCdn"}},{"kind":"Field","name":{"kind":"Name","value":"bankAccountNo"}},{"kind":"Field","name":{"kind":"Name","value":"bankAccountHolderName"}},{"kind":"Field","name":{"kind":"Name","value":"bankIfscCode"}},{"kind":"Field","name":{"kind":"Name","value":"bankSwiftCode"}},{"kind":"Field","name":{"kind":"Name","value":"instagram"}},{"kind":"Field","name":{"kind":"Name","value":"instagramUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isHideNilStock"}},{"kind":"Field","name":{"kind":"Name","value":"isMegamenu"}},{"kind":"Field","name":{"kind":"Name","value":"isOpen"}},{"kind":"Field","name":{"kind":"Name","value":"isSearch"}},{"kind":"Field","name":{"kind":"Name","value":"isHyperlocal"}},{"kind":"Field","name":{"kind":"Name","value":"isFnb"}},{"kind":"Field","name":{"kind":"Name","value":"isWishlist"}},{"kind":"Field","name":{"kind":"Name","value":"isCart"}},{"kind":"Field","name":{"kind":"Name","value":"keywords"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"legalName"}},{"kind":"Field","name":{"kind":"Name","value":"linkedin"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}},{"kind":"Field","name":{"kind":"Name","value":"locality"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"logoDark"}},{"kind":"Field","name":{"kind":"Name","value":"logoMobile"}},{"kind":"Field","name":{"kind":"Name","value":"logoMobileDark"}},{"kind":"Field","name":{"kind":"Name","value":"logoCdn"}},{"kind":"Field","name":{"kind":"Name","value":"logoDarkCdn"}},{"kind":"Field","name":{"kind":"Name","value":"logoMobileCdn"}},{"kind":"Field","name":{"kind":"Name","value":"logoMobileDarkCdn"}},{"kind":"Field","name":{"kind":"Name","value":"minimumOrderValue"}},{"kind":"Field","name":{"kind":"Name","value":"minOrderValue"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"openGraphImage"}},{"kind":"Field","name":{"kind":"Name","value":"openGraphImageCdn"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"pinterestTag"}},{"kind":"Field","name":{"kind":"Name","value":"pinterestUrl"}},{"kind":"Field","name":{"kind":"Name","value":"qrCode"}},{"kind":"Field","name":{"kind":"Name","value":"review"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"moderate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"searchbarText"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"charge"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryDays"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"free"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingCharge"}},{"kind":"Field","name":{"kind":"Name","value":"shopAddress"}},{"kind":"Field","name":{"kind":"Name","value":"shopPhone"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"snapChatPixel"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"storeId"}},{"kind":"Field","name":{"kind":"Name","value":"timeZone"}},{"kind":"Field","name":{"kind":"Name","value":"timing"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"twitter"}},{"kind":"Field","name":{"kind":"Name","value":"twitterUrl"}},{"kind":"Field","name":{"kind":"Name","value":"websiteEmail"}},{"kind":"Field","name":{"kind":"Name","value":"websiteLegalName"}},{"kind":"Field","name":{"kind":"Name","value":"websiteName"}},{"kind":"Field","name":{"kind":"Name","value":"weightUnit"}},{"kind":"Field","name":{"kind":"Name","value":"youtubeUrl"}},{"kind":"Field","name":{"kind":"Name","value":"webmail"}},{"kind":"Field","name":{"kind":"Name","value":"zip"}},{"kind":"Field","name":{"kind":"Name","value":"timeDisplayFormat"}},{"kind":"Field","name":{"kind":"Name","value":"priceDisplayFormat"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"sms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"AUTO_VERIFICATION_ID"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippoToken"}},{"kind":"Field","name":{"kind":"Name","value":"shipRocketEmail"}},{"kind":"Field","name":{"kind":"Name","value":"shipRocketPassword"}},{"kind":"Field","name":{"kind":"Name","value":"shipRocketChannelId"}},{"kind":"Field","name":{"kind":"Name","value":"pickrrAuthToken"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}},{"kind":"Field","name":{"kind":"Name","value":"storeCountry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"default"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"country"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"dialCode"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"flag"}},{"kind":"Field","name":{"kind":"Name","value":"lang"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"storeCurrency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"default"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"isoCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"currency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"isoCode"}},{"kind":"Field","name":{"kind":"Name","value":"isoNumericCode"}},{"kind":"Field","name":{"kind":"Name","value":"thousandsSeparator"}},{"kind":"Field","name":{"kind":"Name","value":"decimalMark"}},{"kind":"Field","name":{"kind":"Name","value":"symbolFirst"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"disambiguateSymbol"}},{"kind":"Field","name":{"kind":"Name","value":"htmlEntity"}},{"kind":"Field","name":{"kind":"Name","value":"subUnit"}},{"kind":"Field","name":{"kind":"Name","value":"smallestDenomination"}},{"kind":"Field","name":{"kind":"Name","value":"subunitToUnit"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"storeLanguage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"default"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"lang"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nativeName"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"phpLocaleCode"}},{"kind":"Field","name":{"kind":"Name","value":"rtl"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}}]}}]}}]} as unknown as DocumentNode<StoreOneQuery, StoreOneQueryVariables>;
export const ChangePasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"changePassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oldPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passwordConfirmation"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changePassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"oldPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oldPassword"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"passwordConfirmation"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passwordConfirmation"}}}]}]}}]} as unknown as DocumentNode<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const EmailPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"emailPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"referrer"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emailPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"referrer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"referrer"}}}]}]}}]} as unknown as DocumentNode<EmailPasswordMutation, EmailPasswordMutationVariables>;
export const GetOtpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"getOtp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"phone"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"role"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"store"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getOtp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"phone"},"value":{"kind":"Variable","name":{"kind":"Name","value":"phone"}}},{"kind":"Argument","name":{"kind":"Name","value":"role"},"value":{"kind":"Variable","name":{"kind":"Name","value":"role"}}},{"kind":"Argument","name":{"kind":"Name","value":"store"},"value":{"kind":"Variable","name":{"kind":"Name","value":"store"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"otp"}},{"kind":"Field","name":{"kind":"Name","value":"timer"}}]}}]}}]} as unknown as DocumentNode<GetOtpMutation, GetOtpMutationVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"avatarCdn"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"store"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vendor"}},{"kind":"Field","name":{"kind":"Name","value":"plan"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"avatarCdn"}},{"kind":"Field","name":{"kind":"Name","value":"referralCode"}},{"kind":"Field","name":{"kind":"Name","value":"currentBalance"}},{"kind":"Field","name":{"kind":"Name","value":"store"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const ResendEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"resendEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resendEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}]}}]} as unknown as DocumentNode<ResendEmailMutation, ResendEmailMutationVariables>;
export const SignOutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"signOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signOut"}}]}}]} as unknown as DocumentNode<SignOutMutation, SignOutMutationVariables>;
export const TopVendorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"topVendors"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"topVendors"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"productSold"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"bannerCdn"}}]}}]}}]} as unknown as DocumentNode<TopVendorsQuery, TopVendorsQueryVariables>;
export const UpdateProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"address"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AddressInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"avatar"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dob"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gender"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"phone"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"info"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"InputInfo"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"shippingCharges"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"freeShippingOn"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"storeName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"banner"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"firstName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}}},{"kind":"Argument","name":{"kind":"Name","value":"lastName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"avatar"},"value":{"kind":"Variable","name":{"kind":"Name","value":"avatar"}}},{"kind":"Argument","name":{"kind":"Name","value":"phone"},"value":{"kind":"Variable","name":{"kind":"Name","value":"phone"}}},{"kind":"Argument","name":{"kind":"Name","value":"dob"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dob"}}},{"kind":"Argument","name":{"kind":"Name","value":"gender"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gender"}}},{"kind":"Argument","name":{"kind":"Name","value":"info"},"value":{"kind":"Variable","name":{"kind":"Name","value":"info"}}},{"kind":"Argument","name":{"kind":"Name","value":"address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"address"}}},{"kind":"Argument","name":{"kind":"Name","value":"shippingCharges"},"value":{"kind":"Variable","name":{"kind":"Name","value":"shippingCharges"}}},{"kind":"Argument","name":{"kind":"Name","value":"freeShippingOn"},"value":{"kind":"Variable","name":{"kind":"Name","value":"freeShippingOn"}}},{"kind":"Argument","name":{"kind":"Name","value":"storeName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"storeName"}}},{"kind":"Argument","name":{"kind":"Name","value":"banner"},"value":{"kind":"Variable","name":{"kind":"Name","value":"banner"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"avatarCdn"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"shippingCharges"}},{"kind":"Field","name":{"kind":"Name","value":"freeShippingOn"}},{"kind":"Field","name":{"kind":"Name","value":"storeName"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"public"}},{"kind":"Field","name":{"kind":"Name","value":"store"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const VerifyEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"verifyEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"expires"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"signature"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"store"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"expires"},"value":{"kind":"Variable","name":{"kind":"Name","value":"expires"}}},{"kind":"Argument","name":{"kind":"Name","value":"signature"},"value":{"kind":"Variable","name":{"kind":"Name","value":"signature"}}},{"kind":"Argument","name":{"kind":"Name","value":"store"},"value":{"kind":"Variable","name":{"kind":"Name","value":"store"}}}]}]}}]} as unknown as DocumentNode<VerifyEmailMutation, VerifyEmailMutationVariables>;
export const VerifyOtpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"verifyOtp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"phone"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"otp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"store"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyOtp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"phone"},"value":{"kind":"Variable","name":{"kind":"Name","value":"phone"}}},{"kind":"Argument","name":{"kind":"Name","value":"otp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"otp"}}},{"kind":"Argument","name":{"kind":"Name","value":"store"},"value":{"kind":"Variable","name":{"kind":"Name","value":"store"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"avatarCdn"}},{"kind":"Field","name":{"kind":"Name","value":"sid"}}]}}]}}]} as unknown as DocumentNode<VerifyOtpMutation, VerifyOtpMutationVariables>;
export const RandomVendorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"randomVendors"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"store"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"randomVendors"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"store"},"value":{"kind":"Variable","name":{"kind":"Name","value":"store"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"bankAccountNo"}},{"kind":"Field","name":{"kind":"Name","value":"bankName"}},{"kind":"Field","name":{"kind":"Name","value":"bankIfsc"}},{"kind":"Field","name":{"kind":"Name","value":"bankAccountHolderName"}},{"kind":"Field","name":{"kind":"Name","value":"bankSwiftCode"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"bannerCdn"}},{"kind":"Field","name":{"kind":"Name","value":"commissionType"}},{"kind":"Field","name":{"kind":"Name","value":"commissionValue"}},{"kind":"Field","name":{"kind":"Name","value":"zips"}},{"kind":"Field","name":{"kind":"Name","value":"freeShippingOn"}},{"kind":"Field","name":{"kind":"Name","value":"meta"}},{"kind":"Field","name":{"kind":"Name","value":"metaDescription"}},{"kind":"Field","name":{"kind":"Name","value":"metaKeywords"}},{"kind":"Field","name":{"kind":"Name","value":"metaTitle"}},{"kind":"Field","name":{"kind":"Name","value":"productSold"}},{"kind":"Field","name":{"kind":"Name","value":"ratings"}},{"kind":"Field","name":{"kind":"Name","value":"reviews"}},{"kind":"Field","name":{"kind":"Name","value":"shippingCharges"}},{"kind":"Field","name":{"kind":"Name","value":"storeName"}},{"kind":"Field","name":{"kind":"Name","value":"facebookUrl"}},{"kind":"Field","name":{"kind":"Name","value":"githubUrl"}},{"kind":"Field","name":{"kind":"Name","value":"googleUrl"}},{"kind":"Field","name":{"kind":"Name","value":"twitterUrl"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"locality"}},{"kind":"Field","name":{"kind":"Name","value":"town"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zip"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<RandomVendorsQuery, RandomVendorsQueryVariables>;
export const VendorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"vendor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vendor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"bankAccountNo"}},{"kind":"Field","name":{"kind":"Name","value":"bankName"}},{"kind":"Field","name":{"kind":"Name","value":"bankIfsc"}},{"kind":"Field","name":{"kind":"Name","value":"bankAccountHolderName"}},{"kind":"Field","name":{"kind":"Name","value":"bankSwiftCode"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"bannerCdn"}},{"kind":"Field","name":{"kind":"Name","value":"commissionType"}},{"kind":"Field","name":{"kind":"Name","value":"commissionValue"}},{"kind":"Field","name":{"kind":"Name","value":"zips"}},{"kind":"Field","name":{"kind":"Name","value":"freeShippingOn"}},{"kind":"Field","name":{"kind":"Name","value":"meta"}},{"kind":"Field","name":{"kind":"Name","value":"metaDescription"}},{"kind":"Field","name":{"kind":"Name","value":"metaKeywords"}},{"kind":"Field","name":{"kind":"Name","value":"metaTitle"}},{"kind":"Field","name":{"kind":"Name","value":"productSold"}},{"kind":"Field","name":{"kind":"Name","value":"ratings"}},{"kind":"Field","name":{"kind":"Name","value":"reviews"}},{"kind":"Field","name":{"kind":"Name","value":"shippingCharges"}},{"kind":"Field","name":{"kind":"Name","value":"storeName"}},{"kind":"Field","name":{"kind":"Name","value":"facebookUrl"}},{"kind":"Field","name":{"kind":"Name","value":"githubUrl"}},{"kind":"Field","name":{"kind":"Name","value":"googleUrl"}},{"kind":"Field","name":{"kind":"Name","value":"twitterUrl"}},{"kind":"Field","name":{"kind":"Name","value":"about"}},{"kind":"Field","name":{"kind":"Name","value":"banners"}},{"kind":"Field","name":{"kind":"Name","value":"bannersCdn"}},{"kind":"Field","name":{"kind":"Name","value":"info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"public"}},{"kind":"Field","name":{"kind":"Name","value":"store"}},{"kind":"Field","name":{"kind":"Name","value":"storePhotos"}}]}},{"kind":"Field","name":{"kind":"Name","value":"country"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"locality"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"zip"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"store"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<VendorQuery, VendorQueryVariables>;
export const VendorProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"vendorProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"vendor"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vendorProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"vendor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"vendor"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"bankAccountNo"}},{"kind":"Field","name":{"kind":"Name","value":"bankName"}},{"kind":"Field","name":{"kind":"Name","value":"bankIfsc"}},{"kind":"Field","name":{"kind":"Name","value":"bankAccountHolderName"}},{"kind":"Field","name":{"kind":"Name","value":"bankSwiftCode"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"bannerCdn"}},{"kind":"Field","name":{"kind":"Name","value":"commissionType"}},{"kind":"Field","name":{"kind":"Name","value":"commissionValue"}},{"kind":"Field","name":{"kind":"Name","value":"zips"}},{"kind":"Field","name":{"kind":"Name","value":"freeShippingOn"}},{"kind":"Field","name":{"kind":"Name","value":"meta"}},{"kind":"Field","name":{"kind":"Name","value":"metaDescription"}},{"kind":"Field","name":{"kind":"Name","value":"metaKeywords"}},{"kind":"Field","name":{"kind":"Name","value":"metaTitle"}},{"kind":"Field","name":{"kind":"Name","value":"productSold"}},{"kind":"Field","name":{"kind":"Name","value":"ratings"}},{"kind":"Field","name":{"kind":"Name","value":"reviews"}},{"kind":"Field","name":{"kind":"Name","value":"shippingCharges"}},{"kind":"Field","name":{"kind":"Name","value":"storeName"}},{"kind":"Field","name":{"kind":"Name","value":"facebookUrl"}},{"kind":"Field","name":{"kind":"Name","value":"githubUrl"}},{"kind":"Field","name":{"kind":"Name","value":"googleUrl"}},{"kind":"Field","name":{"kind":"Name","value":"twitterUrl"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"locality"}},{"kind":"Field","name":{"kind":"Name","value":"town"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"zip"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lng"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}}]}},{"kind":"Field","name":{"kind":"Name","value":"products"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"barcode"}},{"kind":"Field","name":{"kind":"Name","value":"productMasterId"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"mrp"}},{"kind":"Field","name":{"kind":"Name","value":"stock"}},{"kind":"Field","name":{"kind":"Name","value":"trackInventory"}},{"kind":"Field","name":{"kind":"Name","value":"tax"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"imgCdn"}},{"kind":"Field","name":{"kind":"Name","value":"images"}},{"kind":"Field","name":{"kind":"Name","value":"imagesCdn"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"popularity"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"trending"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"hot"}},{"kind":"Field","name":{"kind":"Name","value":"new"}},{"kind":"Field","name":{"kind":"Name","value":"sale"}},{"kind":"Field","name":{"kind":"Name","value":"recommended"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"metaDescription"}},{"kind":"Field","name":{"kind":"Name","value":"keywords"}},{"kind":"Field","name":{"kind":"Name","value":"keywordsA"}},{"kind":"Field","name":{"kind":"Name","value":"ratings"}},{"kind":"Field","name":{"kind":"Name","value":"reviews"}},{"kind":"Field","name":{"kind":"Name","value":"itemId"}},{"kind":"Field","name":{"kind":"Name","value":"warranty"}},{"kind":"Field","name":{"kind":"Name","value":"ageMin"}},{"kind":"Field","name":{"kind":"Name","value":"ageMax"}},{"kind":"Field","name":{"kind":"Name","value":"ageUnit"}},{"kind":"Field","name":{"kind":"Name","value":"cgst"}},{"kind":"Field","name":{"kind":"Name","value":"sgst"}},{"kind":"Field","name":{"kind":"Name","value":"igst"}},{"kind":"Field","name":{"kind":"Name","value":"returnInfo"}},{"kind":"Field","name":{"kind":"Name","value":"returnAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"replaceAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"returnValidityInDays"}},{"kind":"Field","name":{"kind":"Name","value":"sizechart"}},{"kind":"Field","name":{"kind":"Name","value":"batchNo"}},{"kind":"Field","name":{"kind":"Name","value":"mfgDate"}},{"kind":"Field","name":{"kind":"Name","value":"expired"}},{"kind":"Field","name":{"kind":"Name","value":"expiryDate"}},{"kind":"Field","name":{"kind":"Name","value":"isSearchable"}},{"kind":"Field","name":{"kind":"Name","value":"isUnlimited"}},{"kind":"Field","name":{"kind":"Name","value":"totalSold"}},{"kind":"Field","name":{"kind":"Name","value":"preOrder"}},{"kind":"Field","name":{"kind":"Name","value":"zips"}},{"kind":"Field","name":{"kind":"Name","value":"foodType"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryDetails"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<VendorProfileQuery, VendorProfileQueryVariables>;
export const CheckWishlistDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"checkWishlist"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"product"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"variant"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkWishlist"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"product"},"value":{"kind":"Variable","name":{"kind":"Name","value":"product"}}},{"kind":"Argument","name":{"kind":"Name","value":"variant"},"value":{"kind":"Variable","name":{"kind":"Name","value":"variant"}}}]}]}}]} as unknown as DocumentNode<CheckWishlistQuery, CheckWishlistQueryVariables>;
export const MyWishlistDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"myWishlist"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"store"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myWishlist"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}},{"kind":"Argument","name":{"kind":"Name","value":"store"},"value":{"kind":"Variable","name":{"kind":"Name","value":"store"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"img"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"mrp"}},{"kind":"Field","name":{"kind":"Name","value":"formattedPrice"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"foodType"}},{"kind":"Field","name":{"kind":"Name","value":"vendor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"businessName"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"bannerCdn"}}]}},{"kind":"Field","name":{"kind":"Name","value":"brand"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"img"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"variant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"store"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]}}]} as unknown as DocumentNode<MyWishlistQuery, MyWishlistQueryVariables>;
export const ToggleWishlistDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"toggleWishlist"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"product"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"variant"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"toggleWishlist"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"product"},"value":{"kind":"Variable","name":{"kind":"Name","value":"product"}}},{"kind":"Argument","name":{"kind":"Name","value":"variant"},"value":{"kind":"Variable","name":{"kind":"Name","value":"variant"}}}]}]}}]} as unknown as DocumentNode<ToggleWishlistMutation, ToggleWishlistMutationVariables>;

export const RemoveStoreCountry = gql`
    mutation removeStoreCountry($id: ID!) {
  removeStoreCountry(id: $id)
}
    `;
export const SaveStoreCountry = gql`
    mutation saveStoreCountry($id: String!, $country: ID, $default: Boolean, $active: Boolean) {
  saveStoreCountry(id: $id, country: $country, default: $default, active: $active) {
    id
    default
    active
    country
    name
    code
    user
    store
  }
}
    `;
export const StoreCountries = gql`
    query storeCountries($page: Int, $search: String, $limit: Int, $sort: String, $store: ID!) {
  storeCountries(
    page: $page
    search: $search
    limit: $limit
    sort: $sort
    store: $store
  ) {
    count
    page
    pageSize
    data {
      id
      default
      active
      name
      code
      country {
        id
        name
        value
        dialCode
        code
        img
        imgCdn
        flag
        lang
      }
      user {
        id
        firstName
        lastName
        email
      }
    }
  }
}
    `;
export const StoreCountry = gql`
    query storeCountry($id: ID!) {
  storeCountry(id: $id) {
    id
    default
    active
    name
    code
    country {
      id
      name
      value
      dialCode
      code
      img
      imgCdn
      flag
      lang
    }
    user {
      id
      firstName
      lastName
    }
  }
}
    `;
export const Address = gql`
    query address($id: ID!) {
  address(id: $id) {
    id
    email
    firstName
    lastName
    address
    locality
    town
    city
    country
    state
    zip
    phone
    lat
    lng
    active
    verified
    createdAt
    updatedAt
  }
}
    `;
export const Addresses = gql`
    query addresses($page: Int, $search: String, $limit: Int, $sort: String, $store: ID) {
  addresses(
    page: $page
    search: $search
    limit: $limit
    sort: $sort
    store: $store
  ) {
    count
    page
    pageSize
    data {
      id
      email
      firstName
      lastName
      address
      locality
      town
      city
      country
      state
      zip
      phone
      lat
      lng
      active
      verified
      createdAt
      updatedAt
      store
    }
  }
}
    `;
export const DeleteAddress = gql`
    mutation deleteAddress($id: ID!) {
  deleteAddress(id: $id)
}
    `;
export const MyAddresses = gql`
    query myAddresses($page: Int, $search: String, $limit: Int, $sort: String) {
  myAddresses(page: $page, search: $search, limit: $limit, sort: $sort) {
    count
    page
    pageSize
    data {
      id
      email
      firstName
      lastName
      address
      locality
      town
      city
      country
      state
      zip
      phone
      lat
      lng
      active
      verified
      createdAt
      updatedAt
    }
  }
}
    `;
export const SaveAddress = gql`
    mutation saveAddress($id: String!, $firstName: String, $lastName: String, $type: String, $address: String, $locality: String, $town: String, $district: String, $city: String, $country: String, $state: String, $zip: String, $phone: String, $email: String, $lat: Float, $lng: Float, $store: ID, $isResidential: Boolean) {
  saveAddress(
    id: $id
    firstName: $firstName
    lastName: $lastName
    type: $type
    address: $address
    locality: $locality
    town: $town
    district: $district
    city: $city
    country: $country
    state: $state
    zip: $zip
    phone: $phone
    email: $email
    lat: $lat
    lng: $lng
    store: $store
    isResidential: $isResidential
  ) {
    id
    firstName
    lastName
    address
    locality
    town
    district
    city
    type
    country
    state
    zip
    phone
    email
    lat
    lng
    isResidential
    store
  }
}
    `;
export const Blog = gql`
    query blog($id: String!) {
  blog(id: $id) {
    id
    title
    slug
    active
    excerpt
    content
    published_at
    img
    imgCdn
    createdAt
    updatedAt
    user {
      firstName
      lastName
      avatar
    }
    store {
      id
      name
      email
      phone
    }
  }
}
    `;
export const Blogs = gql`
    query blogs($page: Int, $search: String, $limit: Int, $sort: String, $store: ID) {
  blogs(page: $page, search: $search, limit: $limit, sort: $sort, store: $store) {
    count
    page
    pageSize
    data {
      id
      title
      slug
      active
      excerpt
      content
      published_at
      img
      imgCdn
      createdAt
      updatedAt
      user {
        firstName
        lastName
        avatar
      }
      store {
        id
        name
        email
        phone
      }
    }
  }
}
    `;
export const DeleteBlog = gql`
    mutation deleteBlog($id: ID!) {
  deleteBlog(id: $id)
}
    `;
export const SaveBlog = gql`
    mutation saveBlog($id: String!, $title: String, $slug: String, $excerpt: String, $content: String, $published_at: String, $img: String, $tags: [String], $active: Boolean) {
  saveBlog(
    id: $id
    title: $title
    slug: $slug
    excerpt: $excerpt
    content: $content
    published_at: $published_at
    img: $img
    tags: $tags
    active: $active
  ) {
    id
    title
    slug
    active
    excerpt
    content
    published_at
    img
    imgCdn
    tags
    active
  }
}
    `;
export const AddToCart = gql`
    mutation addToCart($qty: Int!, $pid: ID!, $vid: ID, $options: [OptionIp1], $vendor: ID, $replace: Boolean) {
  addToCart(
    qty: $qty
    pid: $pid
    vid: $vid
    options: $options
    vendor: $vendor
    replace: $replace
  ) {
    items {
      pid
      vid
      barcode
      name
      type
      slug
      qty
      price
      shippingCharge
      tax
      img
      imgCdn
      brandName
      vendor
      vendorSlug
      vendorBusinessName
      deliveryDetails
      options {
        option
        values
      }
      usedOptions {
        name
        val
        dates
      }
    }
    needAddress
    qty
    subtotal
    discount {
      code
      value
      text
      amount
    }
    shipping {
      charge
    }
    tax
    total
  }
}
    `;
export const Cart = gql`
    query cart($store: ID) {
  cart(store: $store) {
    id
    storeCurrency
    currencyCode
    currencyName
    currencySymbol
    needAddress
    items {
      pid
      barcode
      tax
      name
      type
      slug
      qty
      price
      mrp
      shippingCharge
      img
      imgCdn
      tracking
      brandName
      vendor
      vendorSlug
      vendorBusinessName
      deliveryDetails
      foodType
      usedOptions {
        name
        val
        dates
      }
      options {
        option
        values
      }
      formattedItemAmount {
        mrp
        price
        tax
        shippingCharge
      }
    }
    qty
    tax
    subtotal
    total
    discount {
      code
      value
      text
      amount
    }
    shipping {
      charge
    }
    formattedAmount {
      offer_total
      tax
      subtotal
      total
    }
    unavailableItems {
      status
      msg
      pid
      barcode
      tax
      name
      type
      slug
      qty
      price
      mrp
      shippingCharge
      img
      imgCdn
      tracking
      brandName
      vendor
      vendorSlug
      vendorBusinessName
      deliveryDetails
      foodType
      usedOptions {
        name
        val
        dates
      }
      options {
        option
        values
      }
    }
  }
}
    `;
export const Checkout = gql`
    mutation checkout($address: ID, $slot: ID) {
  checkout(address: $address, slot: $slot) {
    id
    orderNo
    otp
    createdAt
    updatedAt
    payment {
      id
    }
    paymentMode
    paymentStatus
    paymentCurrency
    paymentReferenceId
    paymentOrderId
    paymentReceipt
    invoiceId
    paymentGateway
    codPaid
    baseCodPaid
    amountPaid
    amountDue
    paymentStatus
    paymentMsg
    paymentTime
    paid
    amount {
      qty
      subtotal
      tax
      discount
      total
      shipping
    }
    baseAmount {
      subtotal
      tax
      discount
      total
      shipping
    }
    userFirstName
    userLastName
    userPhone
    userEmail
    store {
      id
      name
    }
    address {
      firstName
      lastName
      town
      city
      state
      zip
      address
      lat
      lng
    }
    items {
      pid
      status
      posInvoiceNo
      itemOrderNo
      name
      barcode
      img
      imgCdn
      slug
      price
      basePrice
      qty
      shippingCharge
      baseShippingCharge
      tax
      baseTax
      subtotal
      baseSubtotal
      total
      baseTotal
      time
      brandName
      brandImg
      brandImgCdn
      parentBrandName
      parentBrandImg
      parentBrandImgCdn
      color
      size
      vendorAddress {
        firstName
        lastName
        town
        city
        state
        zip
        address
        lat
        lng
      }
      vendor {
        id
        businessName
      }
    }
    orderItems {
      id
    }
  }
}
    `;
export const Categories = gql`
    query categories($page: Int, $search: String, $limit: Int, $sort: String, $megamenu: Boolean, $featured: Boolean, $active: Boolean, $img: Boolean, $shopbycategory: Boolean, $store: ID) {
  categories(
    page: $page
    search: $search
    limit: $limit
    sort: $sort
    megamenu: $megamenu
    featured: $featured
    active: $active
    img: $img
    shopbycategory: $shopbycategory
    store: $store
  ) {
    count
    page
    pageSize
    data {
      id
      name
      namePath
      categoryId
      parent
      slug
      img
      imgCdn
      banner
      bannerCdn
      level
      link
      metaTitle
      metaDescription
      metaKeywords
      keywords
      position
      megamenu
      active
      featured
      featuredSort
      shopbycategory
      createdAt
      updatedAt
      store
    }
  }
}
    `;
export const Category = gql`
    query category($id: String, $slug: String) {
  category(id: $id, slug: $slug) {
    id
    name
    categoryId
    description
    slug
    img
    imgCdn
    banner
    bannerCdn
    level
    link
    pathA {
      slug
      name
    }
    metaTitle
    metaDescription
    metaKeywords
    keywords
    position
    megamenu
    active
    featured
    featuredSort
    shopbycategory
    createdAt
    updatedAt
    parent {
      name
    }
    children {
      id
      name
      img
    }
    attributes {
      id
      name
      show
      category
      active
    }
    brand {
      id
      name
    }
  }
}
    `;
export const Megamenu = gql`
    query megamenu($id: ID, $slug: String, $search: String, $sort: String, $featured: Boolean, $brand: ID, $store: ID) {
  megamenu(
    id: $id
    slug: $slug
    search: $search
    sort: $sort
    featured: $featured
    brand: $brand
    store: $store
  ) {
    id
    name
    slug
    img
    imgCdn
    banner
    bannerCdn
    featured
    link
    children {
      name
      slug
      img
      featured
      link
      children {
        name
        slug
        img
        featured
        link
        children {
          name
          slug
          img
          featured
          link
          children {
            name
            slug
            img
            featured
            link
            children {
              name
              slug
              img
              featured
              link
              children {
                name
                slug
                img
                featured
                children {
                  name
                  slug
                  img
                  featured
                  children {
                    name
                    slug
                    img
                    featured
                    children {
                      name
                      slug
                      img
                      featured
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
    `;
export const Countries = gql`
    query countries($page: Int, $search: String, $limit: Int, $sort: String) {
  countries(page: $page, search: $search, limit: $limit, sort: $sort) {
    count
    page
    pageSize
    data {
      id
      name
      value
      dialCode
      code
      img
      imgCdn
      flag
      lang
      states {
        name
      }
      sort
      active
    }
  }
}
    `;
export const Country = gql`
    query country($id: String) {
  country(id: $id) {
    id
    name
    value
    dialCode
    code
    img
    imgCdn
    flag
    lang
    states {
      name
    }
    sort
    active
  }
}
    `;
export const DeleteCountry = gql`
    mutation deleteCountry($id: ID!) {
  deleteCountry(id: $id)
}
    `;
export const SaveCountry = gql`
    mutation saveCountry($id: String, $name: String, $value: String, $dialCode: String, $code: String, $img: String, $flag: String, $lang: String, $sort: Int, $active: Boolean) {
  saveCountry(
    id: $id
    name: $name
    value: $value
    dialCode: $dialCode
    code: $code
    img: $img
    flag: $flag
    lang: $lang
    sort: $sort
    active: $active
  ) {
    id
    name
    value
    dialCode
    code
    img
    imgCdn
    flag
    lang
    states {
      name
    }
    sort
    active
    createdAt
    updatedAt
  }
}
    `;
export const Init = gql`
    query INIT($domain: String) {
  settings {
    id
    websiteName
    websiteLegalName
    liveCommerce
    multilingual
    closed
    closedMessage
    minimumOrderValue
    title
    alert
    keywords
    description
    tax {
      cgst
      sgst
      igst
    }
    demo
    RAZORPAY_KEY_ID
    GOOGLE_CLIENT_ID
    LIVE_COMMERCE_URL
    stripePublishableKey
    brainTreePublicKey
    enableStripe
    enableRazorpay
    currencyCode
    currencySymbol
    currencyDecimals
    openGraphImage
    shipping {
      deliveryDays
      charge
      free
      method
      enabled
      provider
    }
    userRoles
    websiteEmail
    shopPhone
    shopAddress
    country
    countryDetails {
      id
      name
      value
      dialCode
      code
      img
      imgCdn
      flag
      lang
      active
    }
    currency
    currencyDetails {
      id
      isoCode
      name
      symbol
    }
    logo
    logoMobile
    logoDark
    logoMobileDark
    favicon
    CDN_URL
    S3_URL
    searchbarText
    pageSize
    returnReasons
    orderStatuses {
      status
      title
      body
      icon
      public
      index
    }
    paymentStatuses
    paymentMethods {
      active
      name
      value
      img
      color
      position
      text
    }
    otpLogin
    sms {
      AUTO_VERIFICATION_ID
      enabled
      provider
    }
    email {
      enabled
      from
      cc
      bcc
      printers
    }
    storage {
      enabled
      provider
    }
    review {
      enabled
      moderate
    }
    product {
      moderate
    }
    customerOrderNotifications {
      orderConfirmation
      orderStatusChanged
      orderShipped
      orderIsReadyForPickup
      downloadEGoods
      giftCardPurchased
    }
    adminNotifications {
      newOrderPlaced
      lowStockNotification
    }
    ADMIN_PANEL_LINK
    DOCS_LINK
    storageProvider
    googleMapsApi
    facebook
    twitter
    google
    instagram
    linkedin
    enableTax
    locationExpiry
    WWW_URL
    referralBonus
    joiningBonus
    isMultiVendor
    isMultiStore
    isMegamenu
    isSaas
    isSearch
    foodTypes {
      name
      val
      img
    }
  }
  storeOne(domain: $domain) {
    id
    active
    featured
    adminNotifications {
      lowStockNotification
      newOrderPlaced
    }
    address
    alert
    analyticsTrackingId
    banners
    closed
    isWishlist
    isCart
    closedMessage
    customerOrderNotifications {
      downloadEGoods
      giftCardPurchased
      orderConfirmation
      orderIsReadyForPickup
      orderShipped
      orderStatusChanged
      orderConfirmationSms
    }
    vendorNotifications {
      orderConfirmationSms
    }
    description
    metaDescription
    dimentionUnit
    domain
    email
    facebook
    facebookPixelId
    facebookUrl
    favicon
    faviconCdn
    firstName
    freeShippingOn
    gdpr
    gdprCookieConsent
    google
    googleAdsTag
    homeMeta1
    homeMeta2
    homeMeta3
    homeMeta4
    img
    imgCdn
    images
    imagesCdn
    bankAccountNo
    bankAccountHolderName
    bankIfscCode
    bankSwiftCode
    instagram
    instagramUrl
    isHideNilStock
    isMegamenu
    isOpen
    isSearch
    isHyperlocal
    isFnb
    isWishlist
    isCart
    keywords
    lastName
    lat
    legalName
    linkedin
    lng
    locality
    logo
    logoDark
    logoMobile
    logoMobileDark
    logoCdn
    logoDarkCdn
    logoMobileCdn
    logoMobileDarkCdn
    minimumOrderValue
    minOrderValue
    name
    openGraphImage
    openGraphImageCdn
    pageSize
    phone
    pinterestTag
    pinterestUrl
    qrCode
    review {
      enabled
      moderate
    }
    searchbarText
    shipping {
      charge
      deliveryDays
      enabled
      free
      method
      provider
    }
    shippingCharge
    shopAddress
    shopPhone
    slug
    snapChatPixel
    state
    storeId
    timeZone
    timing
    title
    twitter
    twitterUrl
    websiteEmail
    websiteLegalName
    websiteName
    weightUnit
    youtubeUrl
    webmail
    zip
    timeDisplayFormat
    priceDisplayFormat
    createdAt
    updatedAt
    sms {
      AUTO_VERIFICATION_ID
    }
    shippoToken
    shipRocketEmail
    shipRocketPassword
    shipRocketChannelId
    pickrrAuthToken
    user {
      firstName
      lastName
      email
      phone
    }
    storeCountry {
      id
      default
      active
      name
      code
      country {
        id
        name
        value
        dialCode
        code
        img
        imgCdn
        flag
        lang
      }
    }
    storeCurrency {
      id
      default
      active
      isoCode
      name
      symbol
      currency {
        id
        name
        sort
        isoCode
        isoNumericCode
        thousandsSeparator
        decimalMark
        symbolFirst
        active
        symbol
        disambiguateSymbol
        htmlEntity
        subUnit
        smallestDenomination
        subunitToUnit
      }
    }
    storeLanguage {
      id
      default
      active
      name
      code
      lang {
        id
        name
        nativeName
        code
        phpLocaleCode
        rtl
        sort
        active
      }
    }
  }
  megamenu(domain: $domain) {
    id
    name
    slug
    img
    featured
    children {
      name
      slug
      img
      featured
      children {
        name
        slug
        img
        featured
        children {
          name
          slug
          img
          featured
          children {
            name
            slug
            img
            featured
            children {
              name
              slug
              img
              featured
              children {
                name
                slug
                img
                featured
                children {
                  name
                  slug
                  img
                  featured
                  children {
                    name
                    slug
                    img
                    featured
                    children {
                      name
                      slug
                      img
                      featured
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
    `;
export const Home = gql`
    query HOME($store: ID, $zip: String) {
  brands(parent: null, limit: 30, page: 0, featured: true, store: $store) {
    count
    page
    pageSize
    data {
      id
      brandId
      name
      slug
      img
      imgCdn
      position
      info
      meta
      metaTitle
      metaDescription
      metaKeywords
      facebookUrl
      instaUrl
      twitterUrl
      linkedinUrl
      youtubeUrl
      pinterestUrl
      googleUrl
      active
      featured
      parent {
        id
        name
      }
      store {
        id
        name
        email
        phone
        active
      }
      createdAt
      updatedAt
    }
  }
  categories(img: true, shopbycategory: true, store: $store, sort: "featuredSort") {
    count
    page
    pageSize
    data {
      id
      name
      namePath
      categoryId
      parent
      slug
      img
      imgCdn
      link
      level
      metaTitle
      metaDescription
      metaKeywords
      position
      megamenu
      active
      featured
      shopbycategory
      createdAt
      updatedAt
      store
    }
  }
  banners(sort: "sort", pageId: "home", active: true, store: $store) {
    count
    page
    pageSize
    data {
      id
      link
      heading
      img
      imgCdn
      sort
      type
      pageId
      groupId
      groupTitle
      active
      isMobile
      createdAt
      updatedAt
      store
    }
  }
  youMayLike(store: $store) {
    id
    sku
    barcode
    description
    productMasterId
    slug
    name
    type
    foodType
    price
    mrp
    stock
    tax
    img
    imgCdn
    images
    imagesCdn
    time
    active
    popularity
    position
    trending
    featured
    hot
    new
    sale
    recommended
    title
    metaDescription
    keywords
    ratings
    reviews
    itemId
    warranty
    discount
    ageMin
    ageMax
    ageUnit
    cgst
    sgst
    igst
    returnInfo
    description
    keyFeatures
    expiryDate
    vendor {
      businessName
    }
    productDetails {
      name
      value
    }
    specifications {
      name
      value
    }
    countryOfOrigin
    stock
  }
  trending(type: "hot", store: $store) {
    id
    sku
    barcode
    description
    productMasterId
    slug
    name
    type
    foodType
    price
    mrp
    stock
    tax
    img
    imgCdn
    images
    imagesCdn
    time
    active
    popularity
    position
    trending
    featured
    hot
    new
    sale
    recommended
    title
    metaDescription
    keywords
    ratings
    reviews
    itemId
    warranty
    discount
    ageMin
    ageMax
    ageUnit
    cgst
    sgst
    igst
    returnInfo
    description
    keyFeatures
    expiryDate
    vendor {
      businessName
    }
    productDetails {
      name
      value
    }
    specifications {
      name
      value
    }
    countryOfOrigin
    stock
  }
  popular(store: $store, page: 0, zip: $zip) {
    data {
      id
      slug
      name
      type
      price
      mrp
      discount
      stock
      img
      imgCdn
      images
      imagesCdn
      time
      ratings
      reviews
      zips
      foodType
      expiryDate
      vendor {
        id
        slug
        businessName
        banner
        bannerCdn
      }
    }
    count
    pageSize
    page
  }
  groupByBanner(active: true, pageId: "home", store: $store) {
    _id {
      title
      type
    }
    data {
      link
      heading
      img
      imgCdn
      sort
      type
      pageId
      store
      active
      groupId
      groupTitle
      createdAt
      updatedAt
    }
  }
}
    `;
export const MyOrderItems = gql`
    query myOrderItems($page: Int, $skip: Int, $limit: Int, $search: String, $sort: String, $status: String, $where: String, $store: ID) {
  myOrderItems(
    page: $page
    skip: $skip
    limit: $limit
    search: $search
    sort: $sort
    status: $status
    where: $where
    store: $store
  ) {
    count
    pageSize
    page
    data {
      id
      status
      isReplacement
      pid
      usedOptions {
        name
        val
        dates
      }
      posInvoiceNo
      itemOrderNo
      name
      slug
      img
      imgCdn
      foodType
      tracking
      shippingCharge
      price
      qty
      tax
      brandName
      brandImg
      brandImgCdn
      size
      color
      trackingId
      returnTrackingId
      courierName
      returnCourierName
      orderNo
      otp
      createdAt
      paySuccess
      payment {
        id
      }
      paymentMode
      paymentStatus
      paymentCurrency
      paymentReferenceId
      paymentOrderId
      paymentReceipt
      invoiceId
      paymentGateway
      codPaid
      amountPaid
      amountDue
      paymentMsg
      paymentTime
      paid
      userFirstName
      userLastName
      userPhone
      invoiceLink
      returnValidTill
      paymentMode
      paymentAmount
      vendorBusinessName
      vendor {
        id
        slug
        businessName
        banner
        bannerCdn
      }
      user {
        firstName
        lastName
        email
        phone
        role
      }
      address {
        firstName
        lastName
        address
        lat
        lng
      }
      amount {
        qty
        subtotal
        tax
        discount
        total
        shipping
      }
      payment {
        amountPaid
        amountDue
      }
      store {
        id
        name
        email
      }
      orderHistory {
        id
        status
        title
        body
        icon
        public
        index
        time
      }
    }
  }
}
    `;
export const MyOrders = gql`
    query myOrders($page: Int, $skip: Int, $limit: Int, $search: String, $sort: String, $status: String, $where: String, $store: ID) {
  myOrders(
    page: $page
    skip: $skip
    limit: $limit
    search: $search
    sort: $sort
    status: $status
    where: $where
    store: $store
  ) {
    count
    pageSize
    page
    data {
      id
      paySuccess
      orderNo
      otp
      createdAt
      updatedAt
      codPaid
      payment {
        id
        amountPaid
      }
      paymentMode
      paymentStatus
      paymentCurrency
      paymentReferenceId
      paymentOrderId
      paymentReceipt
      invoiceId
      paymentGateway
      codPaid
      amountPaid
      amountDue
      paymentStatus
      paymentMsg
      paymentTime
      paid
      amount {
        qty
        subtotal
        tax
        discount
        total
        shipping
      }
      userFirstName
      userLastName
      userPhone
      userEmail
      address {
        firstName
        lastName
        town
        city
        state
        zip
        address
        lat
        lng
      }
      store {
        id
        name
        email
      }
      items {
        id
        pid
        status
        posInvoiceNo
        itemOrderNo
        name
        barcode
        img
        imgCdn
        foodType
        slug
        price
        qty
        shippingCharge
        subtotal
        total
        tax
        time
        brandName
        brandImg
        brandImgCdn
        vendorBusinessName
        vendor {
          id
          slug
          businessName
          banner
          bannerCdn
        }
        orderStatus {
          id
          event
          tracking_id
          courier_name
        }
      }
      orderItems {
        id
        status
        pid
        posInvoiceNo
        itemOrderNo
        name
        slug
        img
        imgCdn
        qty
        price
        mrp
        color
        size
        tracking
        shippingCharge
        tax
        subtotal
        total
        brandName
        brandImg
        brandImgCdn
        foodType
        usedOptions {
          name
          val
          dates
        }
      }
    }
  }
}
    `;
export const OrderItem = gql`
    query orderItem($id: ID!) {
  orderItem(id: $id) {
    id
    orderId
    status
    pid
    usedOptions {
      name
      val
      dates
    }
    posInvoiceNo
    invoiceId
    itemOrderNo
    expectedDeliveryDate
    deliveryDetails
    shippingOrderId
    shippingProvider
    shippingLabelId
    shippingRateId
    shippingTrackingNumber
    shippingTrackingStatus
    shippingTrackingUrlProvider
    shippingLabelUrl
    shippingCommercialInvoiceUrl
    name
    slug
    img
    imgCdn
    tracking
    foodType
    shippingCharge
    price
    basePrice
    qty
    tax
    baseTax
    total
    totalDiscount
    subtotal
    brandName
    brandImg
    brandImgCdn
    size
    color
    trackingId
    returnTrackingId
    courierName
    returnCourierName
    replaceValidTill
    returnValidTill
    returnPolicyExpired
    returnReason
    type
    amountRefunded
    baseAmountRefunded
    refunds {
      message
      qty
      time
      amount
      refundId
    }
    orderNo
    otp
    createdAt
    paySuccess
    payment {
      id
    }
    paymentMode
    paymentStatus
    paymentCurrency
    paymentReferenceId
    paymentOrderId
    paymentReceipt
    invoiceId
    paymentGateway
    codPaid
    baseCodPaid
    amountPaid
    amountDue
    totalAmountRefunded
    baseTotalAmountRefunded
    paymentMsg
    paymentTime
    paid
    userFirstName
    userLastName
    userPhone
    userEmail
    invoiceLink
    discount
    baseDiscount
    totalDiscount
    baseTotalDiscount
    weight
    unit
    amount {
      total
      discount
      totalDiscount
      subtotal
    }
    baseAmount {
      total
      discount
      totalDiscount
      subtotal
    }
    user {
      id
      firstName
    }
    address {
      firstName
      lastName
      town
      city
      state
      zip
      address
      lat
      lng
    }
    store {
      id
      name
      email
    }
    slot {
      name
      value
      info
      active
    }
    vendor {
      id
      slug
      businessName
      banner
      bannerCdn
    }
    vendorBusinessName
    vendorPhone
    vendorEmail
    vendorCommissionType
    vendorCommissionValue
    vendorAddress {
      firstName
      lastName
      town
      city
      state
      zip
      address
      lat
      lng
    }
    formattedSubtotal
    formattedShippingCharge
    formattedMrp
    formattedAmountRefunded
    formattedPrice
    formattedTax
    formattedTotal
    formattedTotalDiscount
    formattedVendorCommission
    formattedAmountDue
    formattedAmountPaid
    formattedCodPaid
    formattedDiscount
    formattedPaymentAmount
    formattedTotalAmountRefunded
    formattedAmount {
      subtotal
      tax
      discount
      shipping
      total
      totalDiscount
      exchangeRate
    }
    orderHistory {
      id
      status
      title
      body
      icon
      public
      index
      time
    }
  }
}
    `;
export const PaySuccessPageHit = gql`
    mutation paySuccessPageHit($orderId: ID, $paymentReferenceId: String) {
  paySuccessPageHit(orderId: $orderId, paymentReferenceId: $paymentReferenceId) {
    id
    orderNo
    otp
    createdAt
    paySuccess
    paymentMode
    paymentStatus
    paymentCurrency
    paymentReferenceId
    paymentOrderId
    paymentReceipt
    invoiceId
    paymentGateway
    codPaid
    baseCodPaid
    amountPaid
    amountDue
    paymentMsg
    paymentTime
    paid
    totalAmountRefunded
    baseTotalAmountRefunded
    amount {
      qty
      subtotal
      tax
      discount
      total
      shipping
    }
    baseAmount {
      qty
      subtotal
      tax
      discount
      total
      shipping
    }
    userFirstName
    userLastName
    userPhone
    userEmail
    address {
      firstName
      lastName
      town
      city
      state
      zip
      address
      lat
      lng
    }
    items {
      id
      pid
      posInvoiceNo
      itemOrderNo
      name
      barcode
      img
      imgCdn
      slug
      foodType
      price
      basePrice
      qty
      shippingCharge
      baseShippingCharge
      tax
      baseTax
      time
      usedOptions {
        name
        val
        dates
      }
      brandName
      brandImg
      color
      size
      status
      type
      returnReason
      status
      amountRefunded
      baseAmountRefunded
      vendorBusinessName
      vendorAddress {
        firstName
        lastName
        town
        city
        state
        zip
        address
        lat
        lng
      }
      orderHistory {
        status
        title
        body
        icon
        public
        index
        time
      }
    }
  }
}
    `;
export const CashfreePayNowNew = gql`
    mutation cashfreePayNowNew($address: ID, $slot: ID) {
  cashfreePayNowNew(address: $address, slot: $slot) {
    orderId
    token
    redirectUrl
  }
}
    `;
export const DeletePaymentMethod = gql`
    mutation deletePaymentMethod($id: ID!) {
  deletePaymentMethod(id: $id)
}
    `;
export const PaymentMethod = gql`
    query paymentMethod($id: ID!) {
  paymentMethod(id: $id) {
    id
    name
    img
    imgCdn
    value
    color
    key
    text
    qrcode
    type
    instructions
    position
    active
    isError
  }
}
    `;
export const PaymentMethods = gql`
    query paymentMethods($page: Int, $search: String, $limit: Int, $sort: String, $store: ID, $active: Boolean) {
  paymentMethods(
    page: $page
    search: $search
    limit: $limit
    sort: $sort
    active: $active
    store: $store
  ) {
    count
    page
    pageSize
    data {
      id
      name
      img
      imgCdn
      value
      color
      key
      text
      qrcode
      type
      instructions
      position
      active
    }
  }
}
    `;
export const PaymentMethodsAdmin = gql`
    query paymentMethodsAdmin($page: Int, $search: String, $limit: Int, $sort: String, $active: Boolean, $store: ID) {
  paymentMethodsAdmin(
    page: $page
    search: $search
    limit: $limit
    sort: $sort
    active: $active
    store: $store
  ) {
    count
    page
    pageSize
    data {
      id
      name
      img
      imgCdn
      value
      color
      key
      text
      qrcode
      type
      instructions
      position
      active
      isError
    }
  }
}
    `;
export const SavePaymentMethod = gql`
    mutation savePaymentMethod($id: String!, $name: String, $value: String, $key: String, $color: String, $img: String, $qrcode: String, $type: String, $text: String, $instructions: String, $position: Int, $active: Boolean) {
  savePaymentMethod(
    id: $id
    name: $name
    value: $value
    key: $key
    color: $color
    img: $img
    qrcode: $qrcode
    type: $type
    text: $text
    instructions: $instructions
    position: $position
    active: $active
  ) {
    id
    name
    key
    color
    img
    qrcode
    type
    imgCdn
    text
    instructions
    value
    position
    active
  }
}
    `;
export const Stripe = gql`
    mutation stripe($address: ID, $paymentMethodId: String, $slot: ID) {
  stripe(address: $address, paymentMethodId: $paymentMethodId, slot: $slot) {
    id
    paymentOrderId
    paymentMode
    paymentGateway
    referenceId
    txMsg
    txTime
    invoiceId
    receipt
    paid
    amountPaid
    amountDue
    amountRefunded
    currency
    captured
    status
    orderId
    notes
    refundStatus
    description
    email
    contact
    fee
    tax
    errorCode
    errorDescription
    token
    clientSecret
    approvalUrl
  }
}
    `;
export const Product = gql`
    query product($id: ID!, $zip: String, $optionValues: [ID]) {
  product(id: $id, zip: $zip, optionValues: $optionValues) {
    id
    slug
    name
    description
    type
    price
    mrp
    discount
    stock
    trackInventory
    tax
    img
    imgCdn
    images
    imagesCdn
    time
    active
    popularity
    position
    ratings
    reviews
    sku
    hsn
    group
    barcode
    gender
    gtin
    condition
    trending
    featured
    hot
    new
    sale
    recommended
    title
    itemId
    warranty
    metaDescription
    keywords
    keywordsA
    ageMin
    ageMax
    ageUnit
    styleCode
    eanNo
    articleCode
    productMasterId
    currency
    manufacturer
    countryOfOrigin
    returnInfo
    link
    gender
    condition
    gtin
    cgst
    sgst
    igst
    sizechart
    batchNo
    mfgDate
    expired
    expiryDate
    isSearchable
    isUnlimited
    totalSold
    preOrder
    zips
    foodType
    deliveryDetails
    slots {
      id
      name
      value
    }
    country {
      id
      name
    }
    sizeGroup {
      _id
      slug
      size {
        name
      }
    }
    colorGroup {
      _id
      slug
      color {
        name
        color_code
      }
    }
    brand {
      id
      name
    }
    parentBrand {
      id
      name
    }
    color {
      id
      name
    }
    size {
      id
      name
    }
    category {
      id
      name
      slug
      pathA {
        name
        slug
      }
    }
    categories {
      id
      name
    }
    categoryPool {
      id
      name
    }
    keyFeatures
    features {
      id
      name
      value
    }
    specifications {
      id
      name
      value
    }
    productDetails {
      id
      name
      value
    }
    channels {
      id
      title
      img
      scheduleDateTime
      user {
        firstName
        lastName
      }
    }
    collections {
      id
      name
      description
      active
      images
      img
      q
      sort
      type
    }
    options {
      id
      name
      inputType
      required
      preselectDefault
      position
      values {
        id
        name
        default
        position
        direction
        isPercent
        value
      }
    }
    vendor {
      id
      slug
      businessName
      banner
      bannerCdn
      ratings
      reviews
      info {
        store
        public
        storePhotos
      }
    }
    relatedProducts {
      id
      name
      slug
      img
    }
    returnInfo
    returnAllowed
    replaceAllowed
    returnValidityInDays
    replaceValidityInDays
    files
    unit
    dimensionUnit
    formattedMrp
    formattedPrice
    createdAt
    updatedAt
  }
}
    `;
export const ProductSlug = gql`
    query productSlug($slug: String!) {
  productSlug(slug: $slug) {
    id
    name
    description
    metaDescription
    createdAt
    updatedAt
    sku
    hsn
    popularity
    slug
    img
    imgCdn
    images
    imagesCdn
    price
    mrp
    formattedPrice
    formattedMrp
    stock
    isUnlimited
    trackInventory
    ratings
    reviews
    returnInfo
    replaceValidityInDays
    returnAllowed
    replaceValidityInDays
    replaceAllowed
    color {
      id
      name
    }
    size {
      name
    }
    brand {
      name
    }
    vendor {
      id
      slug
      businessName
      banner
      bannerCdn
      ratings
      reviews
      info {
        store
        public
        storePhotos
      }
    }
  }
}
    `;
export const Products = gql`
    query products($page: Int, $skip: Int, $limit: Int, $search: String, $sku: String, $name: String, $brand: String, $status: String, $price: String, $sort: String, $vendor: String, $category: String, $active: Boolean, $featured: Boolean, $new: Boolean, $hot: Boolean, $sale: Boolean, $where: String, $store: ID, $types: [String]) {
  products(
    page: $page
    skip: $skip
    limit: $limit
    search: $search
    sku: $sku
    name: $name
    brand: $brand
    status: $status
    price: $price
    sort: $sort
    vendor: $vendor
    category: $category
    active: $active
    featured: $featured
    new: $new
    hot: $hot
    sale: $sale
    where: $where
    store: $store
    types: $types
  ) {
    count
    pageSize
    noOfPage
    page
    data {
      id
      sku
      barcode
      productMasterId
      slug
      name
      description
      type
      price
      mrp
      stock
      trackInventory
      tax
      img
      imgCdn
      images
      imagesCdn
      time
      active
      popularity
      position
      trending
      featured
      hot
      new
      sale
      recommended
      title
      metaDescription
      keywords
      keywordsA
      ratings
      reviews
      itemId
      warranty
      ageMin
      ageMax
      ageUnit
      cgst
      sgst
      igst
      returnInfo
      returnAllowed
      replaceAllowed
      returnValidityInDays
      sizechart
      batchNo
      mfgDate
      expired
      expiryDate
      isSearchable
      isUnlimited
      totalSold
      preOrder
      zips
      foodType
      deliveryDetails
      formattedMrp
      formattedPrice
      slots {
        id
        name
        value
      }
      store {
        id
        name
        email
      }
      category {
        name
      }
      vendor {
        id
        slug
        businessName
        banner
        bannerCdn
        ratings
        reviews
        info {
          store
          public
          storePhotos
        }
      }
    }
  }
}
    `;
export const ProductReviews = gql`
    query productReviews($page: Int, $search: String, $limit: Int, $pid: ID!, $active: Boolean) {
  productReviews(
    page: $page
    search: $search
    limit: $limit
    pid: $pid
    active: $active
  ) {
    count
    page
    pageSize
    data {
      id
      rating
      message
      user {
        firstName
        lastName
        avatar
      }
      active
    }
  }
}
    `;
export const Reviews = gql`
    query reviews($page: Int, $search: String, $limit: Int, $sort: String, $store: ID) {
  reviews(page: $page, search: $search, limit: $limit, sort: $sort, store: $store) {
    count
    page
    pageSize
    data {
      id
      rating
      message
      active
      createdAt
      updatedAt
      pid {
        name
        slug
        img
        imgCdn
        type
      }
      user {
        firstName
        lastName
        phone
      }
      vendor {
        id
        slug
        businessName
        banner
        bannerCdn
      }
      store {
        id
        name
        email
      }
    }
  }
}
    `;
export const PopularSearches = gql`
    query popularSearches($page: Int, $limit: Int, $search: String, $sort: String, $store: ID, $domain: String) {
  popularSearches(
    page: $page
    search: $search
    limit: $limit
    sort: $sort
    store: $store
    domain: $domain
  ) {
    count
    page
    pageSize
    data {
      id
      text
      popularity
      store {
        id
        name
        email
        phone
      }
    }
  }
}
    `;
export const Settings = gql`
    query settings {
  settings {
    id
    websiteName
    websiteLegalName
    liveCommerce
    multilingual
    closed
    closedMessage
    minimumOrderValue
    title
    alert
    keywords
    description
    tax {
      cgst
      sgst
      igst
    }
    demo
    RAZORPAY_KEY_ID
    GOOGLE_CLIENT_ID
    stripePublishableKey
    brainTreePublicKey
    enableStripe
    enableSubsription
    enableRazorpay
    currencyCode
    currencySymbol
    currencyDecimals
    openGraphImage
    shipping {
      deliveryDays
      charge
      free
      method
      enabled
      provider
    }
    userRoles
    websiteEmail
    shopPhone
    shopAddress
    country
    countryDetails {
      id
      name
      value
      dialCode
      code
      img
      imgCdn
      flag
      lang
      active
    }
    currency
    currencyDetails {
      id
      isoCode
      name
      symbol
    }
    lang
    langDetails {
      id
      name
      nativeName
      code
    }
    logo
    logoMobile
    logoDark
    logoMobileDark
    favicon
    CDN_URL
    S3_URL
    LIVE_COMMERCE_URL
    searchbarText
    pageSize
    returnReasons
    orderStatuses {
      status
      title
      body
      icon
      public
      index
    }
    paymentStatuses
    paymentMethods {
      active
      name
      value
      img
      color
      position
      text
    }
    otpLogin
    sms {
      AUTO_VERIFICATION_ID
      enabled
      provider
    }
    email {
      enabled
      from
      cc
      bcc
      printers
    }
    storage {
      enabled
      provider
    }
    review {
      enabled
      moderate
    }
    product {
      moderate
    }
    customerOrderNotifications {
      orderConfirmation
      orderStatusChanged
      orderShipped
      orderIsReadyForPickup
      downloadEGoods
      giftCardPurchased
    }
    adminNotifications {
      newOrderPlaced
      lowStockNotification
    }
    ADMIN_PANEL_LINK
    DOCS_LINK
    storageProvider
    googleMapsApi
    facebook
    twitter
    google
    instagram
    linkedin
    enableTax
    locationExpiry
    WWW_URL
    referralBonus
    joiningBonus
    isMultiVendor
    isMultiStore
    isMegamenu
    isSaas
    isSearch
    foodTypes {
      name
      val
      img
    }
  }
}
    `;
export const States = gql`
    query states($page: Int, $search: String, $limit: Int, $sort: String, $country: ID, $countryCode: String) {
  states(
    page: $page
    search: $search
    limit: $limit
    sort: $sort
    country: $country
    countryCode: $countryCode
  ) {
    count
    page
    pageSize
    data {
      id
      name
      value
      code
      img
      imgCdn
      flag
      lang
      sort
      active
      createdAt
      updatedAt
    }
  }
}
    `;
export const Store = gql`
    query store {
  store {
    id
    active
    adminNotifications {
      lowStockNotification
      newOrderPlaced
    }
    address
    alert
    analyticsTrackingId
    banners
    city
    closed
    closedMessage
    customerOrderNotifications {
      downloadEGoods
      giftCardPurchased
      orderConfirmation
      orderIsReadyForPickup
      orderShipped
      orderStatusChanged
      orderConfirmationSms
    }
    vendorNotifications {
      orderConfirmationSms
    }
    description
    metaDescription
    dimentionUnit
    domain
    email
    facebook
    facebookPixelId
    facebookUrl
    favicon
    faviconCdn
    firstName
    freeShippingOn
    gdpr
    gdprCookieConsent
    google
    googleAdsTag
    homeMeta1
    homeMeta2
    homeMeta3
    homeMeta4
    img
    imgCdn
    images
    imagesCdn
    instagram
    instagramUrl
    isHideNilStock
    isMegamenu
    isOpen
    isSearch
    isHyperlocal
    isFnb
    isWishlist
    isCart
    keywords
    lastName
    lat
    legalName
    linkedin
    lng
    locality
    logo
    logoDark
    logoMobile
    logoMobileDark
    logoCdn
    logoDarkCdn
    logoMobileCdn
    logoMobileDarkCdn
    minimumOrderValue
    name
    openGraphImage
    openGraphImageCdn
    pageSize
    phone
    pinterestTag
    pinterestUrl
    qrCode
    review {
      enabled
      moderate
    }
    searchbarText
    shipping {
      charge
      deliveryDays
      enabled
      free
      method
      provider
    }
    shippingCharge
    shopAddress
    shopPhone
    slug
    snapChatPixel
    state
    storeId
    bankAccountNo
    bankAccountHolderName
    bankIfscCode
    bankSwiftCode
    timeZone
    timing
    title
    twitter
    twitterUrl
    websiteEmail
    websiteLegalName
    websiteName
    weightUnit
    youtubeUrl
    webmail
    zip
    timeDisplayFormat
    priceDisplayFormat
    createdAt
    updatedAt
    user
    sms {
      AUTO_VERIFICATION_ID
    }
    shippoToken
    shipRocketEmail
    shipRocketPassword
    shipRocketChannelId
    pickrrAuthToken
    storeTiming {
      day
      fromTime
      index
      isOpen
      online
      toTime
    }
  }
}
    `;
export const StoreOne = gql`
    query storeOne($id: ID, $slug: String, $domain: String) {
  storeOne(id: $id, slug: $slug, domain: $domain) {
    id
    active
    featured
    adminNotifications {
      lowStockNotification
      newOrderPlaced
    }
    address
    alert
    analyticsTrackingId
    banners
    closed
    isWishlist
    isCart
    closedMessage
    customerOrderNotifications {
      downloadEGoods
      giftCardPurchased
      orderConfirmation
      orderIsReadyForPickup
      orderShipped
      orderStatusChanged
      orderConfirmationSms
    }
    vendorNotifications {
      orderConfirmationSms
    }
    description
    metaDescription
    dimentionUnit
    domain
    email
    facebook
    facebookPixelId
    facebookUrl
    favicon
    faviconCdn
    firstName
    freeShippingOn
    gdpr
    gdprCookieConsent
    google
    googleAdsTag
    homeMeta1
    homeMeta2
    homeMeta3
    homeMeta4
    img
    imgCdn
    images
    imagesCdn
    bankAccountNo
    bankAccountHolderName
    bankIfscCode
    bankSwiftCode
    instagram
    instagramUrl
    isHideNilStock
    isMegamenu
    isOpen
    isSearch
    isHyperlocal
    isFnb
    isWishlist
    isCart
    keywords
    lastName
    lat
    legalName
    linkedin
    lng
    locality
    logo
    logoDark
    logoMobile
    logoMobileDark
    logoCdn
    logoDarkCdn
    logoMobileCdn
    logoMobileDarkCdn
    minimumOrderValue
    minOrderValue
    name
    openGraphImage
    openGraphImageCdn
    pageSize
    phone
    pinterestTag
    pinterestUrl
    qrCode
    review {
      enabled
      moderate
    }
    searchbarText
    shipping {
      charge
      deliveryDays
      enabled
      free
      method
      provider
    }
    shippingCharge
    shopAddress
    shopPhone
    slug
    snapChatPixel
    state
    storeId
    timeZone
    timing
    title
    twitter
    twitterUrl
    websiteEmail
    websiteLegalName
    websiteName
    weightUnit
    youtubeUrl
    webmail
    zip
    timeDisplayFormat
    priceDisplayFormat
    createdAt
    updatedAt
    sms {
      AUTO_VERIFICATION_ID
    }
    shippoToken
    shipRocketEmail
    shipRocketPassword
    shipRocketChannelId
    pickrrAuthToken
    user {
      firstName
      lastName
      email
      phone
    }
    storeCountry {
      id
      default
      active
      name
      code
      country {
        id
        name
        value
        dialCode
        code
        img
        imgCdn
        flag
        lang
      }
    }
    storeCurrency {
      id
      default
      active
      isoCode
      name
      symbol
      currency {
        id
        name
        sort
        isoCode
        isoNumericCode
        thousandsSeparator
        decimalMark
        symbolFirst
        active
        symbol
        disambiguateSymbol
        htmlEntity
        subUnit
        smallestDenomination
        subunitToUnit
      }
    }
    storeLanguage {
      id
      default
      active
      name
      code
      lang {
        id
        name
        nativeName
        code
        phpLocaleCode
        rtl
        sort
        active
      }
    }
  }
}
    `;
export const ChangePassword = gql`
    mutation changePassword($oldPassword: String!, $password: String!, $passwordConfirmation: String!) {
  changePassword(
    oldPassword: $oldPassword
    password: $password
    passwordConfirmation: $passwordConfirmation
  )
}
    `;
export const EmailPassword = gql`
    mutation emailPassword($email: String!, $referrer: String!) {
  emailPassword(email: $email, referrer: $referrer)
}
    `;
export const GetOtp = gql`
    mutation getOtp($phone: String!, $role: String, $store: ID) {
  getOtp(phone: $phone, role: $role, store: $store) {
    otp
    timer
  }
}
    `;
export const Login = gql`
    mutation login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    id
    email
    firstName
    lastName
    city
    phone
    avatar
    avatarCdn
    role
    verified
    active
    provider
    store {
      name
    }
    vendor
    plan
    createdAt
    updatedAt
  }
}
    `;
export const Me = gql`
    query me {
  me {
    id
    firstName
    lastName
    email
    phone
    gender
    role
    verified
    active
    provider
    avatar
    avatarCdn
    referralCode
    currentBalance
    store
  }
}
    `;
export const ResendEmail = gql`
    mutation resendEmail($email: String) {
  resendEmail(email: $email)
}
    `;
export const SignOut = gql`
    mutation signOut {
  signOut
}
    `;
export const TopVendors = gql`
    query topVendors($limit: Int) {
  topVendors(limit: $limit) {
    id
    businessName
    productSold
    banner
    bannerCdn
  }
}
    `;
export const UpdateProfile = gql`
    mutation updateProfile($address: AddressInput, $firstName: String, $lastName: String, $email: String, $avatar: String, $dob: String, $gender: String, $phone: String, $info: InputInfo, $shippingCharges: Int, $freeShippingOn: Int, $storeName: String, $banner: String) {
  updateProfile(
    firstName: $firstName
    lastName: $lastName
    email: $email
    avatar: $avatar
    phone: $phone
    dob: $dob
    gender: $gender
    info: $info
    address: $address
    shippingCharges: $shippingCharges
    freeShippingOn: $freeShippingOn
    storeName: $storeName
    banner: $banner
  ) {
    firstName
    lastName
    email
    phone
    avatar
    avatarCdn
    role
    gender
    city
    shippingCharges
    freeShippingOn
    storeName
    banner
    info {
      public
      store
    }
  }
}
    `;
export const VerifyEmail = gql`
    mutation verifyEmail($id: ID!, $token: String!, $expires: String!, $signature: String!, $store: ID) {
  verifyEmail(
    id: $id
    token: $token
    expires: $expires
    signature: $signature
    store: $store
  )
}
    `;
export const VerifyOtp = gql`
    mutation verifyOtp($phone: String!, $otp: String!, $store: ID) {
  verifyOtp(phone: $phone, otp: $otp, store: $store) {
    id
    firstName
    lastName
    email
    phone
    role
    verified
    active
    avatar
    avatarCdn
    sid
  }
}
    `;
export const RandomVendors = gql`
    query randomVendors($store: ID) {
  randomVendors(store: $store) {
    id
    slug
    businessName
    description
    verified
    bankAccountNo
    bankName
    bankIfsc
    bankAccountHolderName
    bankSwiftCode
    banner
    bannerCdn
    commissionType
    commissionValue
    zips
    freeShippingOn
    meta
    metaDescription
    metaKeywords
    metaTitle
    productSold
    ratings
    reviews
    shippingCharges
    storeName
    facebookUrl
    githubUrl
    googleUrl
    twitterUrl
    user {
      id
      avatar
      firstName
      lastName
    }
    address {
      id
      email
      firstName
      lastName
      address
      locality
      town
      city
      country
      state
      zip
      phone
      lat
      lng
    }
    categories {
      id
      name
      img
      imgCdn
    }
    createdAt
    updatedAt
  }
}
    `;
export const Vendor = gql`
    query vendor($id: ID) {
  vendor(id: $id) {
    id
    slug
    businessName
    categories {
      id
    }
    verified
    bankAccountNo
    bankName
    bankIfsc
    bankAccountHolderName
    bankSwiftCode
    banner
    bannerCdn
    commissionType
    commissionValue
    zips
    freeShippingOn
    meta
    metaDescription
    metaKeywords
    metaTitle
    productSold
    ratings
    reviews
    shippingCharges
    storeName
    facebookUrl
    githubUrl
    googleUrl
    twitterUrl
    about
    banners
    bannersCdn
    info {
      public
      store
      storePhotos
    }
    country {
      id
      name
    }
    user {
      id
      avatar
    }
    address {
      id
      firstName
      lastName
      address
      locality
      city
      state
      country
      zip
      lat
      lng
    }
    categories {
      id
      name
    }
    store {
      id
      name
      email
    }
    createdAt
    updatedAt
  }
}
    `;
export const VendorProfile = gql`
    query vendorProfile($vendor: ID!) {
  vendorProfile(vendor: $vendor) {
    id
    slug
    businessName
    description
    verified
    bankAccountNo
    bankName
    bankIfsc
    bankAccountHolderName
    bankSwiftCode
    banner
    bannerCdn
    commissionType
    commissionValue
    zips
    freeShippingOn
    meta
    metaDescription
    metaKeywords
    metaTitle
    productSold
    ratings
    reviews
    shippingCharges
    storeName
    facebookUrl
    githubUrl
    googleUrl
    twitterUrl
    user {
      id
      avatar
      firstName
      lastName
    }
    address {
      id
      email
      firstName
      lastName
      address
      locality
      town
      city
      country
      state
      zip
      phone
      lat
      lng
    }
    categories {
      id
      name
      img
      imgCdn
    }
    products {
      count
      page
      pageSize
      data {
        id
        sku
        barcode
        productMasterId
        slug
        name
        description
        type
        price
        mrp
        stock
        trackInventory
        tax
        img
        imgCdn
        images
        imagesCdn
        time
        active
        popularity
        position
        trending
        featured
        hot
        new
        sale
        recommended
        title
        metaDescription
        keywords
        keywordsA
        ratings
        reviews
        itemId
        warranty
        ageMin
        ageMax
        ageUnit
        cgst
        sgst
        igst
        returnInfo
        returnAllowed
        replaceAllowed
        returnValidityInDays
        sizechart
        batchNo
        mfgDate
        expired
        expiryDate
        isSearchable
        isUnlimited
        totalSold
        preOrder
        zips
        foodType
        deliveryDetails
      }
    }
    createdAt
    updatedAt
  }
}
    `;
export const CheckWishlist = gql`
    query checkWishlist($product: ID!, $variant: ID!) {
  checkWishlist(product: $product, variant: $variant)
}
    `;
export const MyWishlist = gql`
    query myWishlist($page: Int, $search: String, $limit: Int, $sort: String, $store: ID) {
  myWishlist(
    page: $page
    search: $search
    limit: $limit
    sort: $sort
    store: $store
  ) {
    count
    page
    pageSize
    data {
      id
      active
      createdAt
      updatedAt
      product {
        id
        name
        slug
        img
        price
        mrp
        formattedPrice
        discount
        foodType
        vendor {
          id
          slug
          businessName
          banner
          bannerCdn
        }
        brand {
          id
          name
          img
        }
      }
      variant {
        id
        name
      }
      user {
        id
        firstName
        lastName
      }
      store {
        id
        name
        email
      }
    }
  }
}
    `;
export const ToggleWishlist = gql`
    mutation toggleWishlist($product: ID!, $variant: ID!) {
  toggleWishlist(product: $product, variant: $variant)
}
    `;