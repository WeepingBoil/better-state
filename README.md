# Better-State

#### Including "No Going Back"

This is a small wrapper that encapsulates

* [history.pushState()](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState)
* [history.replaceState()](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState), and
* [window.onpopstate()](https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate)

  

## Features

1. View the browser history[^1] for your app.
2. Prevent the use of the browser's back and forward buttons.
  ("No Going Back")
3. Get more information in the onpopstate event, such as whether the back button or forward button was pressed...
4. Includes the current window.scroll for convenience (useful when using [History.scrollRestoration  = 'manual'](https://developer.mozilla.org/en-US/docs/Web/API/History/scrollRestoration))

  
## Installation

`npm install better-state`

  
## Setup

`import betterState from "better-state";`


---


## Known Issues

Preventing the browser back button is a bit of a hack - and definitely not supported by most modern browsers.

Please test thoroughly before using in a production environment.

(Because it's not possible to actually prevent the back button event, **better-state** forces an immediate history.go(1)  )


---


## Usage

To change the current browser URL and add to the browser history:

`betterState.pushState(url)`

`betterState.pushState(url,{--some consumer-data})`


---


To prevent the use of the browser's back and forward buttons:

  ("No Going Back")

`betterState.preventBack = true`

`betterState.preventForward = true`


---


To get the current known history[^1]:

`betterState.history`


---


To subscribe to popstate events (i.e. back and forward button clicks...)

`betterState.on("state-change", (e) => { console.log(e); });`

returns:
- back: [ *true | false* ] if the back button was pressed.
- forward: [ *true | false* ] if the forward button was pressed.
- prevented: [ *true | false* ] if the pop was prevented.
- forced: [ *true | false* ] if the pop was forced[^2]
- state: { _Object_ } including:
  - url
  - scrollX
  - scrollY
  - data: { _Object_ } any consumer data


---


To override `preventBack` and `preventForward`:

`betterState.forceForward()`

`betterState.forceBack()`


---


To replace the current state:

  (i.e. to change the current URL without adding to the browser history)

`betterState.replaceState(url)`

`betterState.replaceState(url,{--some consumer-data})`


---


To get the current state:

`betterState.state`


---


[^1]: Only includes better-state history.

[^2]: See forceBack() and forceForward(). 
  
