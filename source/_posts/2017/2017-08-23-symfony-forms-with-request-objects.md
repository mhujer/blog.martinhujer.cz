---
title: Don't Use Entities in Symfony Forms. Use Custom Data Objects Instead
showPhpTrainingAd: true
---

> First part of this article explains why entities should not be used directly in Symfony Forms. Second part presents an approach which solves most of the problems presented in the first part.

Let's start with stating that **using entities for validation in Symfony Forms** is widely used and widely recommend approach. Even the [official documentation](https://symfony.com/doc/current/forms.html) suggests it.

**And I don't think it is a good idea!**

**Why?**


###  1. An entity should be always valid.

An entity should be always valid. It should not be possible for the entity to get to some inconsistent state. And that's exactly what the form validation is doing. When the form is submitted, the data are injected (through public properties or setters) into the entity and validated. And even if the validation fails, the invalid data are kept there and you have an invalid entity at hand. 

> Read [those slides](https://ocramius.github.io/doctrine-best-practices/) from Ocramius or [watch the video](https://vimeo.com/134178140) for great explanation what is means to have a valid entity (and much more).

It's also not that hard to imagine the situation when this can cause you serious trouble. If the entity is already managed by EntityManager (because it is an `updateAction`) and there is a `$entityManager->flush()` call lurking in some listener, you'd end up with invalid data stored in database.

### 2. Change! Change! Change!

The only sure thing about the software development is "change". Eventually you will need to change the structure of the form, maybe split it in two-step form. And the form fields will no longer map exactly 1:1 to entity's fields.

### 3. Layers separation
It breaks the layers separation. Each layer should depend only on the deeper ones, not the other way around.

----

What can we do instead of using entities in forms? Symfony documentation describes [how to use forms with data stored in array](https://symfony.com/doc/current/form/without_class.html). It is a viable solution, but it has disadvantages as well. Some I can think of is that you won't get code completion in IDE for the form data. Or that it is hard to statically analyze arrays with tools such as [PHPStan](https://github.com/phpstan/phpstan).

And there is another solution, the one I prefer.

## Custom Data Classes for the win

To get around the disadvantages mentioned above, I suggest using a custom class to represent the form data. 

Let's have a look at the example:

```php
use Symfony\Component\Validator\Constraints as Assert;

class CreateArticleRequest
{

    /**
     * @Assert\NotBlank()
     * @Assert\Length(min="10", max="100")
     * @var string
     */
    public $title;

    /**
     * @Assert\NotBlank()
     * @var string
     */
    public $content;

    /**
     * @Assert\DateTime()
     * @var \DateTimeImmutable
     */
    public $publishDate;

}
```

It is a simple class that has some public properties and validator annotations. The main advantage is that is has nothing to do with the actual entity. `CreateArticleRequest` can handle as much of invalid data as you want and it won't cause you any trouble.

Second step is using the request object in the controller. You can use it the same way you'd use the entity (the following code should be self-explanatory):

```php
  /**
     * @Route("/article/create/", name="article_create")
     */
    public function createAction(Request $request)
    {
        // create an instance of an empty CreateArticleRequest
        $createArticleRequest = new CreateArticleRequest();

        // create a form but with a request object instead of entity
        $form = $this->createForm(ArticleFormType::class, $createArticleRequest);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            // ArticleFacade creates instance of an Article,
            // persists it and flushes the EntityManager.
            // (details are out of scope of this article)

            $article = $this->articleFacade->createArticle(
                $createArticleRequest->title,
                $createArticleRequest->content,
                $createArticleRequest->publishDate
            );

            // ... use $article to add title to flash message or something

            return $this->redirectToRoute('articles_list');
        }

        // render the form if it is the first request or if the validation failed
        return $this->render('article/add-article.html.twig', [
            'form' => $form->createView(),
        ]);
    }
```

And for the sake of completeness, the source of `ArticleFormType`:

```php
class ArticleFormType extends \Symfony\Component\Form\AbstractType
{

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title', TextType::class, [
                'label' => 'Article title',
            ])
            ->add('content', TextareaType::class, [
                'label' => 'Article content',
            ])
            ->add('publishDate', DateTimeType::class, [
                'label' => 'Publish on',
            ])
            ->add('save', SubmitType::class, [
                'label' => 'Save',
            ]);
    }
}
```

I call the data class `CreateArticleRequest` because it is a _`Request`_ to create an article. You will probably also have a `UpdateArticleRequest` class with different properties (in some cases, both classes may be the same, so one `ArticleRequest` would be sufficient).

The `*Request` suffix may cause some confusion with the `Request` class which represents a HTTP request. If that is your case, you are free to change the suffix to `*Data` and use a class called `CreateArticleData`.


## What about update form?

One of the specifics of the update is that it won't necessarily have the exact same fields as the "create". In the example, we don't want to update the `publishDate` field in the entity. The `UpdateArticleRequest` will look like this:

```php
use Symfony\Component\Validator\Constraints as Assert;

class UpdateArticleRequest
{

    /**
     * @Assert\NotBlank()
     * @Assert\Length(min="10", max="100")
     * @var string
     */
    public $title;

    /**
     * @Assert\NotBlank()
     * @var string
     */
    public $content;

    public static function fromArticle(Article $article): self
    {
        $articleRequest = new self();
        $articleRequest->title = $article->getTitle();
        $articleRequest->content = $article->getContent();

        return $articleRequest;
    }
}
```

You can see that the `$publishDate` field is missing, but more importantly, we have a new method there - `fromArticle(Article $article)`. It allows you to prepopulate the data from the existing article.

Check the following example of `updateAction()` to see how to use it in controller:

```php
    /**
     * @Route("/article/update/{id}/", name="article_update")
     */
    public function updateAction(Article $article, Request $request)
    {
        // the $article argument is converted from {id} by implicit ParamConverter

        // pre-populate the UpdateArticleRequest instance with the data from the article
        $updateArticleRequest = UpdateArticleRequest::fromArticle($article);

        $form = $this->createForm(UpdateArticleFormType::class, $updateArticleRequest);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            // ArticleFacade updates instance of an Article and flushes the EntityManager.
            // (details are out of scope of this article)

            $this->articleFacade->updateArticle(
                $article,
                $updateArticleRequest->title,
                $updateArticleRequest->content
            );

            // ... use $article to add title to flash message or something

            return $this->redirectToRoute('articles_list');
        }

        return $this->render('article/edit-article.html.twig', [
            'form' => $form->createView(),
        ]);
    }
```

You may think - that's a lot of code to write! I agree, but rest assured it is worth it in the long run. If your app contains some business logic and is not just a plain CRUD, it will eventually need different fields and validation rules during _create_ and _update_. Then you will make good use of this extra code you had written.

## Conclusion

In the article, I suggested why it may not be the best idea to use entities in Symfony Forms. The second part of the article proposes a way how to tackle this problem - by using a custom object instead of entity to carry the data and handle the validation.

There are two more takeaways:

1. Always separate the application layers.
2. Do not blindly follow the documentation (or other developers).


**Do you use similar solution in your projects? If you are using entities, have you already encountered any problems?**

Finally, you may want to read two related articles: [Avoiding Entities in Forms](https://stovepipe.systems/post/avoiding-entities-in-forms) and [Rethinking Form Development](https://stovepipe.systems/post/rethinking-form-development) (written by Iltar van der Berg).
