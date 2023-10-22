# Contact API Spec

## Create Contact API

Endpoint : POST /api/contacts

Headers :

- Authorization : token

Request Body :

```json
{
  "firstName": "Indra",
  "lastName": "Wijaya",
  "email": "indra@gmail.com",
  "phone": "085821559461"
}
```

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "firstName": "Indra",
    "lastName": "Wijaya",
    "email": "indra@gmail.com",
    "phone": "085821559461"
  }
}
```

Response Body Error :

```json
{
  "errors": "Email is not valid format"
}
```

## Update Contact API

Endpoint : PUT /api/contacts/:id

Headers :

- Authorization : token

Request Body :

```json
{
  "firstName": "Fadli",
  "lastName": "Jaunum",
  "email": "fadli@gmail.com",
  "phone": "085821559461"
}
```

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "firstName": "Fadli",
    "lastName": "Jaunum",
    "email": "fadli@gmail.com",
    "phone": "085821559461"
  }
}
```

Response Body Error :

```json
{
  "errors": "Email is not valid format"
}
```

## Get Contact API

Endpoint : GET /api/contacts/:id

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "firstName": "Fadli",
    "lastName": "Jaunum",
    "email": "fadli@gmail.com",
    "phone": "085821559461"
  }
}
```

Response Body Error :

```json
{
  "errors": "Contact is not found"
}
```

## search Contact API

Endpoint : GET /api/contacts

Headers :

- Authorization : token

Query Params :

- name : Seacrh by firstName or lastName, using like, optional
- email : Search by email using like, optional
- phone: Search by phone using like, optional
- page : number of page, default 1
- size : size per page, default 10

Response Body Success :

```json
{
  "data": [
    {
      "id": 1,
      "firstName": "Fadli",
      "lastName": "Jaunum",
      "email": "fadli@gmail.com",
      "phone": "085821559461"
    },
    {
      "id": 2,
      "firstName": "Fadli",
      "lastName": "Jaunum",
      "email": "fadli@gmail.com",
      "phone": "085821559461"
    }
  ],
  "paging": {
    "page": 1,
    "total_page": 3,
    "total_item": 30
  }
}
```

Response Body Error :

```json
{
  "errors": "Contact is not found"
}
```

## Remove Contact API

Endpoint : DELETE /api/contacts/:id

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": "OK"
}
```

Response Body Error :

```json
{
  "errors": "Contact is not found"
}
```
