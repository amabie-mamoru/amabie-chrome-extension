manifest.json は json なのでコメントアウトができない

そこで、yaml から変換することで yaml 側でコメントアウトして対処できるようにする

そのために yq (yaml > json 変換コマンド) を入れる

```sh
brew install python-yq
```

python3.9 を入れるために xcode-select を入れるよう指示されるケースがあるのでその場合は指示に従う

```sh
xcode-select
```

特に指定がなかったり上記インストールができていてシェルがリフレッシュできていれば yq が使えるようになる

yq で template.yaml から manifest.json に変換する

コマンドは以下の通り

```sh
yq . template.yaml > manifest.json
```

第一引数のドットは全てを意味する

もし一部だけ出力したい場合は以下のように指定すると、 name プロパティ配下の内容を manifest.json に書き出すことも可能

```sh
yq .name .template.yaml > manifest.json
```
