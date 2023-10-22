# User API Spec

## Register User API

Endpoint : POST /api/users

Request Body :

```json
{
  "username": "indraw01",
  "password": "rahasia",
  "name": "Indra Wijaya"
}
```

Response Body Success :

```json
{
  "data": {
    "username": "indraw01",
    "name": "Indra Wijaya"
  }
}
```

Response Body Error :

```json
{
  "errors": "Username already registered"
}
```

## Login User API

Endpoint : POST api/users/login

Request Body :

```json
{
  "username": "indraw01",
  "password": "rahasia"
}
```

Response Body Success :

```json
{
  "data": {
    "token": "unique-token"
  }
}
```

Response Body Error :

```json
{
  "errors": "Username or password wrong"
}
```

## Update User API <!-- Update user login saja -->

Endpoint : PATCH /api/users/current

Headers :

- Authorization : token

Request Body :

```json
{
  "name": "Indra Wijaya Ganteng", // optional
  "password": "rahasialagi" // otional
}
```

Response Body Sucess :

```json
{
  "data": {
    "username": "indraw01",
    "name": "Indra Wijaya Ganteng"
  }
}
```

Response Body Error :

```json
{
  "errors": "Name length max 100, Password length min 3"
}
```

## Get User API

Endpoint : GET api/users/current

Headers :

- Authorization : token

Response Body Sucess :

```json
{
  "data": {
    "username": "indraw01",
    "name": "Indra Wijaya Ganteng"
  }
}
```

Response Body Error :

```json
{
  "errors": "Unauthorized"
}
```

## Logout User API

Endpoint : DELETE /api/users/logout

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": "OK"
}
```

```json
{
  "errors": "Unauthorized"
}
```
