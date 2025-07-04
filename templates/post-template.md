---
title: blog-format
createdAt: 0000-01-01
updatedAt: 0000-01-01
version : 1
thumbnail: /images/posts/pencil01.svg
isPublished: false
---
# h1 Heading
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading

## Horizontal Rules

___

---

***

## Emphasis

**This is bold text**

__This is bold text__

*This is italic text*

_This is italic text_


> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done

A table:

| a   | b   |
| --- | --- |

## Blockquotes

> Blockquotes can also be nested...
>> ...by using additional greater-than signs right next to each other...
> > > ...or with spaces between arrows.


## Lists

Unordered

+ Create a list by starting a line with `+`, `-`, or `*`
+ Sub-lists are made by indenting 2 spaces:
  - Marker character change forces new list start:
    * Ac tristique libero volutpat at
    + Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
+ Very easy!

Ordered

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa

1. You can use sequential numbers...
1. ...or keep all the numbers as `1.`

Start numbering with offset:

57. foo
1. bar

## Code

Inline `code`

Indented code

    // Some comments
    line 1 of code
    line 2 of code
    line 3 of code


Block code "fences"

```
Sample text here...
```

Syntax highlighting

``` js
var foo = function (bar) {
  return bar++;
};

console.log(foo(5));
```

## Links

[link text](http://dev.nodeca.com)

[link with title](http://nodeca.github.io/pica/demo/ "title text!")

Autoconverted link https://github.com/nodeca/pica (enable linkify to see)


## Images

![Minion](https://octodex.github.com/images/minion.png)
![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")

Like links, Images also have a footnote style syntax

![Alt text][id]

With a reference later in the document defining the URL location:

[id]: https://octodex.github.com/images/dojocat.jpg  "The Dojocat"

## Link card

title, host, url, image
```Link
Element: insertAdjacentHTML() メソッド - Web API | MDN
developer.mozilla.org
https://developer.mozilla.org/ja/docs/Web/API/Element/insertAdjacentHTML
https://developer.mozilla.org/mdn-social-share.d893525a4fb5fb1f67a2.png
```

```Link
オリジナル企業キャラクターを #コミケ #C97 企業ブースに出展してみた | DevelopersIO
dev.classmethod.jp
https://dev.classmethod.jp/articles/comiket97/
https://devio2023-media.developers.io/wp-content/uploads/2019/12/mesoko-comike.png
```

```Amazon
なぜ私たちは燃え尽きてしまうのか
amazon.co.jp
https://www.amazon.co.jp/dp/4791775910
https://m.media-amazon.com/images/I/71vdZpm7AFL._SL1500_.jpg
```
