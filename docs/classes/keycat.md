

# Hierarchy

**Keycat**

# Constructors

<a id="constructor"></a>

##  constructor

⊕ **new Keycat**(config: *[KeycatConfig](../interfaces/keycatconfig.md)*): [Keycat](keycat.md)

*Defined in [index.ts:41](https://github.com/EOSDAQ/keycatjs/blob/2754518/src/index.ts#L41)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| config | [KeycatConfig](../interfaces/keycatconfig.md) |

**Returns:** [Keycat](keycat.md)

___

# Properties

<a id="config"></a>

## `<Private>` config

**● config**: *[KeycatConfig](../interfaces/keycatconfig.md)*

*Defined in [index.ts:39](https://github.com/EOSDAQ/keycatjs/blob/2754518/src/index.ts#L39)*

___
<a id="keycatorigin"></a>

##  keycatOrigin

**● keycatOrigin**: *`string`*

*Defined in [index.ts:41](https://github.com/EOSDAQ/keycatjs/blob/2754518/src/index.ts#L41)*

___
<a id="popup"></a>

## `<Private>` popup

**● popup**: *`Window`*

*Defined in [index.ts:40](https://github.com/EOSDAQ/keycatjs/blob/2754518/src/index.ts#L40)*

___

# Methods

<a id="buildsrc"></a>

## `<Private>` buildSrc

▸ **buildSrc**(path: *`string`*, params?: *`object`*): `string`

*Defined in [index.ts:60](https://github.com/EOSDAQ/keycatjs/blob/2754518/src/index.ts#L60)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| path | `string` | - |
| `Default value` params | `object` |  {} |

**Returns:** `string`

___
<a id="getkeycatorigin"></a>

## `<Private>` getKeycatOrigin

▸ **getKeycatOrigin**(): `string`

*Defined in [index.ts:48](https://github.com/EOSDAQ/keycatjs/blob/2754518/src/index.ts#L48)*

**Returns:** `string`

___
<a id="open"></a>

## `<Private>` open

▸ **open**<`T`>(src: *`any`*): `Promise`<`T`>

*Defined in [index.ts:73](https://github.com/EOSDAQ/keycatjs/blob/2754518/src/index.ts#L73)*

**Type parameters:**

#### T 
**Parameters:**

| Name | Type |
| ------ | ------ |
| src | `any` |

**Returns:** `Promise`<`T`>

___
<a id="openpopup"></a>

## `<Private>` openPopup

▸ **openPopup**(src: *`any`*, deferred: *`any`*): `void`

*Defined in [index.ts:86](https://github.com/EOSDAQ/keycatjs/blob/2754518/src/index.ts#L86)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| src | `any` |
| deferred | `any` |

**Returns:** `void`

___
<a id="respond"></a>

## `<Private>` respond

▸ **respond**(data: *`any`*, promise: *[Deferred](deferred.md)<`any`>*): `void`

*Defined in [index.ts:101](https://github.com/EOSDAQ/keycatjs/blob/2754518/src/index.ts#L101)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| data | `any` |
| promise | [Deferred](deferred.md)<`any`> |

**Returns:** `void`

___
<a id="signin"></a>

##  signin

▸ **signin**(): `Promise`<[ISigninResult](../interfaces/isigninresult.md)>

*Defined in [index.ts:115](https://github.com/EOSDAQ/keycatjs/blob/2754518/src/index.ts#L115)*

**Returns:** `Promise`<[ISigninResult](../interfaces/isigninresult.md)>

___
<a id="transact"></a>

##  transact

▸ **transact**(account: *`any`*, tx: *`any`*): `Promise`<`any`>

*Defined in [index.ts:119](https://github.com/EOSDAQ/keycatjs/blob/2754518/src/index.ts#L119)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| account | `any` |
| tx | `any` |

**Returns:** `Promise`<`any`>

___

