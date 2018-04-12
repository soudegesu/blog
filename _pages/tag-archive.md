---
layout: archive
permalink: /tags/
title: "Posts by Tags"
author_profile: true
---

{% include base_path %}
{% include group-by-array collection=site.posts field="tags" %}

<ul class="taxonomy__index">
  {% assign tags_max = 0 %}
  {% for tag in site.tags %}
    {% if tag[1].size > tags_max %}
      {% assign tags_max = tag[1].size %}
    {% endif %}
  {% endfor %}
  {% for i in (1..tags_max) reversed %}
    {% for tag in site.tags %}
      {% if tag[1].size == i %}
        <li>
          <a href="#{{ tag[0] | slugify }}">
            <strong>{{ tag[0] }}</strong> <span class="taxonomy__count">{{ i }}</span>
          </a>
        </li>
      {% endif %}
    {% endfor %}
  {% endfor %}
</ul>

{% for tag in group_names %}
  {% assign posts = group_items[forloop.index0] %}
  <h2 id="{{ tag | slugify }}" class="archive__subtitle">{{ tag }}</h2>
  {% for post in posts %}
    {% include archive-single.html %}
  {% endfor %}
{% endfor %}