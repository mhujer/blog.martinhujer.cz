---
title: Anki AI - Add example sentences to Anki notes with ChatGPT
---

I've been learning German for almost a year, and I already have around 3 000 notes in my Anki database (Anki is an app for learning vocabulary using spaced repetition technique). But unlike English, where I can get high quality example sentences from [Cambridge Dictionary](https://dictionary.cambridge.org/), I have yet to find similar source for German vocabulary.

When the new and cheaper [Chat Completion](https://platform.openai.com/docs/guides/chat) API from OpenAI became available I thought it may be the way forward. I tried it in the Chat GPT first, and it worked pretty great (Chat Completion API allows you the access the model used in ChatGPT using the API):

![ChatGPT can generate example sentences for German vocabulary.](/data/2023/2023-03-16-anki-ai-example-sentences-for-anki-with-chat-gpt/anki-ai-1.png)

I tried it again and prefixed the inputs with IDs so the output can be parsed more easily:

![ChatGPT can generate example sentences for German vocabulary with IDs.](/data/2023/2023-03-16-anki-ai-example-sentences-for-anki-with-chat-gpt/anki-ai-2.png)

## Using GPT to Generate Example Sentences in Anki
Using GPT for generating example sentences seemed viable, so I considered my options to use it to generate examples to my whole German vocabulary database in Anki.

Even though Anki allows you to create plugins, they must be written in Python, so I decided to use another approach. There is a [Anki Connect](https://github.com/FooSoft/anki-connect) plugin which makes the Anki data available through REST API. I have been using quite a lot of  TypeScript recently (It's fun to use it!) so it was my first choice to writing my app.

Fetching the data from Anki was easy. Chat GPT even helped me craft regular expressions to clean up the vocabulary data. As a result, I only passed the words to the API.

Next, I had to create a prompt for the API. This is a final version which persuades the Chat API to return same format of the response every time:

> _You are a helpful vocabulary learning assistant who helps user generate example sentences in German for language learning. I will provide each word prefixed by ID and you will generate two example sentences for each input. Each sentence in response must be on its own line and starting with ID I provided so it can be parsed with regex `/^(\d+): (.*)$/`_

```
1675192165662: Schulden machen
1675192165652: der Lieferant
1675192165655: vollkommen
```

With such input, you get response like this (interestingly, the sentences are different every time you try it): 

```
1675192165662: Man sollte sich immer genau überlegen, bevor Schulden gemacht werden
1675192165662: Schulden machen kann in der Zukunft zu großen finanziellen Problemen führen.
1675192165652: Der Lieferant hat das Paket heute Morgen geliefert.
1675192165652: Ich kann mich immer auf meinen Lieferanten verlassen.
1675192165655: Sie ist vollkommen glücklich mit ihrem neuen Job.
1675192165655: Das Essen war vollkommen in Ordnung, aber nicht besonders lecker.
```

The remaining steps were straightforward: parse the output and feed the data back into Anki.


## Conclusion
The simple script I created (you can [check the source code on GitHub](https://github.com/mhujer/ankiai)) helped me generate the example sentences for my whole German database in Anki (~3 000 notes) and the API cost was around $0.5. That's why I did not bother optimizing the prompt length in any way (e.g., one optimization can be shortening the IDs, but there was no point in doing so).

I appreciate that the generated sentences are coherent and resemble real-world examples of the language (as far as I can tell).

If you want to try to use the script for your vocabulary, I added instructions to the [README in the GitHub repository](https://github.com/mhujer/ankiai).
