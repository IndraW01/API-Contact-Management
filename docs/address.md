# Address API Spec

## Create Address API

Endpoint : POST api/contacts/:contactId/addresses

Heders :

- Authorization - token

Request Body :

```json
{
  "street": "Jalan BPP",
  "city": "Samarinda",
  "province": "Kaltim",
  "country": "Indonesia",
  "postalCode": "7821"
}
```

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "street": "Jalan BPP",
    "city": "Samarinda",
    "province": "Kaltim",
    "country": "Indonesia",
    "postalCode": "7821"
  }
}
```

Response Body Error :

```json
{
  "errors": "Country is required"
}
```

## Update Create Address API

Endpoint : PUT api/contacts/:contactId/adsresses/:addressId

Heders :

- Authorization - token

Request Body :

```json
{
  "street": "Jalan BPP",
  "city": "Samarinda",
  "province": "Kaltim",
  "country": "Indonesia",
  "postalCode": "7821"
}
```

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "street": "Jalan BPP",
    "city": "Samarinda",
    "province": "Kaltim",
    "country": "Indonesia",
    "postalCode": "7821"
  }
}
```

Response Body Error :

```json
{
  "errors": "Country is required"
}
```

## Get Address API

Endpoint : GET api/contacts/:contactId/addresses/:addressId

Heders :

- Authorization - token

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "street": "Jalan BPP",
    "city": "Samarinda",
    "province": "Kaltim",
    "country": "Indonesia",
    "postalCode": "7821"
  }
}
```

Response Body Error :

```json
{
  "errors": "Contact is not found"
}
```

## List Address API

Endpoint : GET api/contacts/:contactId/adresses

Heders :

- Authorization - token

Response Body Success :

```json
{
  "data": [
    {
      "id": 1,
      "street": "Jalan BPP",
      "city": "Samarinda",
      "province": "Kaltim",
      "country": "Indonesia",
      "postalCode": "7821"
    },
    {
      "id": 2,
      "street": "Jalan BPP",
      "city": "Samarinda",
      "province": "Kaltim",
      "country": "Indonesia",
      "postalCode": "7821"
    }
  ]
}
```

Response Body Error :

```json
{
  "errors": "Contact is not found"
}
```

## Remove Address API

Endpoint : DELETE api/contacts/:contactId/adresses/:addressId

Heders :

- Authorization - token

Response Body Success :

```json
{
  "data": "OK"
}
```

Response Body Error :

```json
{
  "errors": "Address is not found"
}
```
