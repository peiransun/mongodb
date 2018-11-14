# Setting Up A MongoDB Database with Docker
For the purpose of this tutorial, I’m going to be using docker in order to quickly get a mongodb instance up and running on my local development machine.

``` linux
$ docker pull mongo
$ docker run --name my_mongo -d -p 127.0.0.1:27017:27017 mongo
``` 

[Note]
If you already have a mongodb instance up and running then please feel free to ignore this step and carry on using your own instance.


# Node.js + Typescript 2.x + MongoDB – Quick start  
 
我前段時間寫的快速入門系列的第一部分。今天它有點過時，所以我建議你查看我的YouTube視頻，在那裡我展示如何配置VS Code以使用Typescript創建node.js應用程序。

在這篇文章中，我想繼續快速入門系列，並向您展示如何從node.js連接到MongoDB數據庫。

在我們開始編寫代碼之前，我們需要能夠連接到MongoDB服務器。我們有3個選擇：

在本地計算機上安裝  MongoDB Community Edition服務器
使用官方MongoDB Docker鏡像運行服務器
在MongoDB Atlas上註冊，它提供MongoDB作為服務，允許您免費測試基本副本集。值得一提的是，MongoDB Atlas允許您選擇運行數據庫服務器的雲提供程序。目前，有3個雲提供商可供使用：AWS，Google Cloud Platform，Microsoft Azure。
隨意選擇最方便的選項。從代碼的角度來看，連接的位置並不重要。如果您不熟悉Docker或者您不想在本地計算機上安裝任何附加工具，那麼MongoDB Atlas上的免費計劃似乎是最佳選擇。

## 安裝包
一旦你的MongoDB服務器準備就緒並運行，我們就可以編寫一些代碼。一開始，我們需要安裝兩個npm的軟件包。第一個是mongodb  ，它包含MongoDB的本機node.js驅動程序。
要安裝它，請運行以下命令：

``` javascript
npm install mongodb --save
``` 
然後是第二個用於類型定義：

``` javascript
npm install @types/mongodb –save-dev
``` 
## 在單例對像中存儲數據庫連接
為了避免在查詢數據庫之前每次都連接到MongoDB，我們將把打開的連接存儲在singleton對像中。讓我們創建一個新文件DbClient.ts並將其保存在公共 文件夾中。單例類將如下所示：

**方法 1 :**
``` typescript
import { MongoClient, Db } from "mongodb";

export class DbClient {
    public db: Db;

    public connect() { /* ... */ }
}
 
```

**方法 2 :**
``` typescript
import { MongoClient, Db } from "mongodb";

class DbClient {
    public db: Db;

    public connect() { /* ... */ }
}

export = new DbClient();
```
在第一行中，我們從mongodb包導入了  MongoClient和Db類型。DbClient類包含一個方法connect（），我們將連接到MongoDB數據庫，然後將連接保存為類成員。在最後一行中，我們導出了一個DbClient類的新實例。每次我們通過調用使用/加載DbClient時都會返回該實例 

**方法 1 :**
``` typescript
import { DbClient } from "./common/dbClient";
```  



**方法 2 :**
``` typescript
import DbClient = require(“../common/DbClient”);
``` 

## 連接數據庫 - 回調方法
現在讓我們添加使用MongoClient並連接到數據庫。默認情況下，MongoClient允許您將回調函數作為最後一個參數傳遞，該參數將在建立連接或發生錯誤時調用。

``` typescript
MongoClient.connect("mongodb://localhost:27017/test", (err, db) => {
     if(err) {
         console.log(err);
     } else {
         this.db = db;
     } 
 });
```

## 連接到數據庫 - 承諾方法
您也可以跳過傳遞回調函數，然後MongoClient將返回一個新的Promise。

``` typescript
return MongoClient.connect("mongodb://localhost:27017/test")
    .then(db => {
        this.db = db;
    })
    .catch(err => {
        console.log(err);
    });
```

## 連接到數據庫 - 異步/等待方法
從Typescript 2.1開始，您也可以使用async / await方法 - 即使您需要將TypesScript代碼轉換為ES5或ES3版本的Javascript。
您可以async/await在TypeScript Deep Dive在線書籍  和Marius Schulz的博客中閱讀有關Typescript的  更多信息 （BTW。我建議將這兩個網站添加到您的書籤中！）。

``` typescript
try {
    this.db = await MongoClient.connect("mongodb://localhost:27017/test");
    console.log("Connected to db");
    return this.db;
} catch (error) {
    console.log("Unable to connect to db");
}
```

## 利用DbClient
DbClient已準備就緒。在主應用程序文件app.ts中，讓我們通過調用導入它， 

**方法 1:**
``` typescript
import { DbClient } from "./common/dbClient";
``` 

**方法 2:**
``` typescript
import DbClient = require("./common/DbClient");
``` 

然後我們可以嘗試連接到數據庫並運行基本查詢：

**方法 1:**
``` typescript
try {
    let db = await new DbClient().connect();

    let results = await db.collection("todo").insertOne({
        topic: "learn angular.js", progress: 10
    });

    console.log(results.insertedId);

    let results2 = await db.collection("todo").insertMany([
        {  topic: "learn typescript", progress: 10 },
        {  topic: "learn node.js", progress: 10 }
    ]);

    console.log(results2.insertedIds);

    let docs = await db.collection("todo").find().toArray();

    console.log(docs);
} catch (error) {
    console.log("Unable to connect to db");
}
```

**方法 2:**
``` typescript
try {
    let db = await DbClient.connect();

    let results = await db.collection("todo").insertOne({
        topic: "learn angular.js", progress: 10
    });

    console.log(results.insertedId);

    let results2 = await db.collection("todo").insertMany([
        {  topic: "learn typescript", progress: 10 },
        {  topic: "learn node.js", progress: 10 }
    ]);

    console.log(results2.insertedIds);

    let docs = await db.collection("todo").find().toArray();

    console.log(docs);
} catch (error) {
    console.log("Unable to connect to db");
}
```
---
### 請注意，MongoDB服務器上不必存在數據庫。它將由MongoDB服務器通過第一次保存操作自動創建。這同樣適用於收藏品。

完整代碼可在此處獲得。如果您有任何疑問，請在評論中告訴我。DbClient.connect方法的最終版本如下所示：
``` typescript
public async connect() {
    this.db = await MongoClient.connect("mongodb://localhost:27017/test");
    console.log("Connected to db");
    return this.db;
}
```
 