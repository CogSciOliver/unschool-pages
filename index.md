---
title: Considering Unschooling?
description: A lived cultural perspective on unschooling and self-directed learning.
layout: layout.html
---

*New to unschooling or just getting started?*

## Welcome
Unschool Discoveries is here to help you define for you and your family how freeing this journey of living fully with your kids can be. No one knows what will work best until you and your kids give it a try. 

What we also can help with is getting yourself ready for the journey ahead. Unschooling is about trusting your kids and yourself. It means making news choices, letting go of ideas about authority, and releasing old patterns of schoolishness. 

Here are a few topics to get you started. If you have questions feel free to email us directly. 

## Getting Started Topics
{% for post in collections.topic %}
- [{{ post.data.title }}]({{ post.url}})
  {% endfor %}

## Unschooling FAQs
{% for post in collections.unschooling %}
- [{{ post.data.title }}]({{ post.url}})
  {% endfor %}

## The Deschooling Lab
{% for post in collections.lab %}
- [{{ post.data.title }}]({{ post.url}})
  {% endfor %}