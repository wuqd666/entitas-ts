# entitas-ts

Entitas ECS
Typescript implementation ported from https://github.com/sschmid/Entitas-CSharp

    +------------------+
    |       Pool       |
    |------------------|
    |    e       e     |      +-----------+
    |        e     e---|----> |  Entity   |
    |  e        e      |      |-----------|
    |     e  e       e |      | Component |
    | e            e   |      |           |      +-----------+
    |    e     e       |      | Component-|----> | Component |
    |  e    e     e    |      |           |      |-----------|
    |    e      e    e |      | Component |      |   Data    |
    +------------------+      +-----------+      +-----------+
      |
      |
      |     +-------------+  Groups:
      |     |      e      |  Subsets of entities in the pool
      |     |   e     e   |  for blazing fast querying
      +---> |        +------------+
            |     e  |    |       |
            |  e     | e  |  e    |
            +--------|----+    e  |
                     |     e      |
                     |  e     e   |
                     +------------+
    
Status: testing...

generate classes & extensions:

    bin/entitas


# MIT License

Copyright (c) 2015 Bruce Davidson &lt;darkoverlordofdata@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
