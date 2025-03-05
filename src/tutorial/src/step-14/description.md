# Slots {#slots}

En plus de transmettre des données via les props, le composant parent peut également transmettre des fragments du template à l'enfant via les **slots** :

<div class="sfc">

```vue-html
<ChildComp>
  Il y a un slot!
</ChildComp>
```

</div>
<div class="html">

```vue-html
<child-comp>
  Il y a un slot!
</child-comp>
```

</div>

Dans le composant enfant, il peut render le contenu du slot du parent en utilisant l'élément `<slot>` comme sortie :

<div class="sfc">

```vue-html
<!-- dans le template de l'enfant -->
<slot/>
```

</div>
<div class="html">

```vue-html
<!-- dans le template de l'enfant -->
<slot></slot>
```

</div>

Le contenu à l'intérieur de la sortie `<slot>` sera traité comme un contenu de "secours" : il sera affiché si le parent n'a pas transmis de contenu au slot :

```vue-html
<slot>Contenu de secours</slot>
```

Actuellement, nous ne passons aucun contenu au slot de `<ChildComp>`, donc vous devriez voir le contenu de secours. Fournissons un contenu au slot de l'enfant tout en utilisant le state `msg` du parent.
