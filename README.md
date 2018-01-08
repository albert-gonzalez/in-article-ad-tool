# inArticleAdTool

Tool for inserting an Ad repeatedly between elements. Is designed for Google's inArticleAd, but it could be used for other ads.

## INSTALL

npm install in-article-ad-tool

## USAGE

### SCRIPT

```html
<script src="inArticleAdToolPath/dist/inArticleAdTool.min.js"></script>
<script>
    inArticleAdTool.init(options);
</script>
```

### ESM

```js
    import inArticleAdTool from 'in-article-ad-tool';

    inArticleAdTool.init(options);
```

### OPTIONS

* containerSelector: CSS Selector of the element(s) that contains the children where the ad code will be inserted. Required.
* elementSelector: CSS Selector of the container's children. Default: 'p'.
* adCode: Ad Code that will be inserted. It can be an String or a function. Required.
* firstAppearance: Number of elements needed before the first ad will be inserted. Default: 3.
* insertEvery: Number of elements needed before the ad will be inserted again. If this value is 0 the ad will not be inserted again. Default: 3

### Example

#### HTML

```html
<div class="container">
    <p>
    </p>
    <p>
    </p>
    <p>
    </p>
    <p>
    </p>
    <p>
    </p>
</div>
```

#### JS

```js
inArticleAdTool.init({
    containerSelector: '.container',
    elementSelector: 'p',
    adCode: `
    <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
    <ins class="adsbygoogle"
        style="display:block; text-align:center;"
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="your-client"
        data-ad-slot="your-slot"></ins>
    <script type="text/javascript">
        (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
    `,
    firstAppearance: 2,
    insertEvery: 2
});
```

#### Result

```html
<div class="container">
    <p>
    </p>
    <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
    <ins class="adsbygoogle"
        style="display:block; text-align:center;"
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="your-client"
        data-ad-slot="your-slot"></ins>
    <script type="text/javascript">
        (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
    <p>
    </p>
    <p>
    </p>
    <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
    <ins class="adsbygoogle"
        style="display:block; text-align:center;"
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="your-client"
        data-ad-slot="your-slot"></ins>
    <script type="text/javascript">
        (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
    <p>
    </p>
    <p>
    </p>
</div>
```
