# Make Real

Use this repo as a template to create Make Real style apps like
[makereal.tldraw.com](https://makereal.tldraw.com). To get started:

1. Clone the repo using git clone and cd to new dir
2. Run `npm install` to install dependencies
3. Get an OpenAI API key from [platform.openai.com/api-keys](https://platform.openai.com/api-keys). Make sure
   you are at least a
   [Tier 1](https://platform.openai.com/docs/guides/rate-limits/usage-tiers) API
   user, which means you have access to GPT-4 Vision. You can check your tier on
   the [OpenAI API Limits](https://platform.openai.com/account/limits).
4. Run `npm start`
5. cd to server, create an .env file and store your ANTHROPIC_API_KEY in it
6. run node server.js to get access to anthropic models (Because of CORS issues, I had to use a server for claude inference)
7. Open [localhost:3000](http://localhost:3000) 
8. Press the 'RiskyButCoolAPIKeyInput', enter your OPENAI API key and make some stuff real!

## How it works

Make Real is built with [tldraw](https://tldraw.dev), a very good React library for
creating whiteboards and other infinite canvas experiences.

To use it, first draw a mockup for a piece of UI. When
you're ready, select the drawing, and press the Make Real button.
We'll capture an image of your selection, and send it to
[OpenAI's GPT-4V](https://platform.openai.com/docs/guides/vision) along with
instructions to turn it into a HTML file.

We take the HTML response and add it to a tldraw
[custom shape](https://tldraw.dev/docs/shapes#Custom-shapes). The custom shape
shows the response in an iframe so that you can interact with it on the canvas. If you
want to iterate on the response, annotate the iframe, select it all, and press 'Make Real' again.

## To make changes

To change how Make Real works, start from the [`makeReal()`](./app/makeReal.tsx)
function. From there, you can change the prompt that gets sent to gpt-4.

If you'd like Make Real to create something other than HTML, you'll need to
either update the [`PreviewShape`](./app/PreviewShape/PreviewShape.tsx) to
display something different, or use one of tldraw's built-in shapes like image
or text.

## The dangerous API key input method

For prototyping or at least until the vision APIs are able to support higher usage limits, we've also included the `RiskyButCoolAPIKeyInput`, similar to the one found on [makereal.tldraw.com](https://makereal.tldraw.com). Please use this as carefully and ethically as you can, as users should be reluctant to add API keys to public sites.
