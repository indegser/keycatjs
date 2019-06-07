# Configuration

## Config

Becoming a super hero is a fairly straight forward process:

```
$ give me super-powers
```

{% hint style="info" %}
 Keycat currently supports EOS and Klaytn. If you are interested in Keycat and seeking for integration with your blockchain. Please contact [here](mailto://indegser@eosdaq.com)
{% endhint %}

{% code-tabs %}
{% code-tabs-item title="eosconfig.ts" %}
```typescript
interface EOSConfig {
    name: 'eos';
    network: 'main'|'jungle'|'custom';
    nodes?: string[]
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}



