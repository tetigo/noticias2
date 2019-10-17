# Notícias


Simples aplicativo que mostra mensagens públicas, privadas e administrativas de acordo com autenticação e autorização.

Usuários anônimos conseguem ver notícias públicas.

Usuários cadastrados conseguem ver notícias públicas, privadas e administrativas, de acordo com "roles".

Depois que um usuário está logado, o sistema verifica qual o papel que o usuário está assumindo agora para mostrar páginas e menus de acordo.
É possível trocar entre os papéis de um usuário para ver notícias diferentes, sempre de acordo com o papel.
Caso usuário tente acessar área restrita, vai ser automaticamente redirecionado para página principal.


## Config

Cirar o arquivo (.env) no mesmo local onde está o readme.md e incluir as seguintes chaves com suas IDs e Secrets tanto do Google quanto do Facebook:

- clientIDFace
- clientSecretFace
- clientIDGoog
- clientSecretGoog

### Exemplo


```
clientIDFace=xxxxxxxxxxxxxxxxxxxx
clientSecretFace=xxxxxxxxxxxxxxxxxxxx
clientIDGoog=xxxxxxxxxxxxxxxxxxxx
clientSecretGoog=xxxxxxxxxxxxxxxxxxxx
```


