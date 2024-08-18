import { useAuthenticator, Input, Label, Flex, Button, Alert, TextAreaField } from '@aws-amplify/ui-react';
import React, { useEffect, useState } from 'react';
import slugify from '../../../libs/slugify';

function Index() {
  const { authStatus, user } = useAuthenticator(context => [context.authStatus, context.user]);
  console.log('user =>', user);

  const [alertVariation, setAlertVariation] = useState('success');
  const [alertText, setAlertText] = useState('Data successfully written');
  const [showAlert, setShowAlert] = useState(false);
  const [slugText, SetSlugText] = useState('');

  const formRef = React.useRef(null);

  useEffect(() => {
    if (authStatus === 'configuring') {
      return;
    }

    if (authStatus === 'unauthenticated') {
      console.log('redirecting to /login');
      window.location.href = '/login';
      return;
    }
  }, [authStatus]);

  const handleTitleChange = function(title) {
    const slug = slugify(title);
    SetSlugText(slug);
  }

  const writeBlogPost = async function(event) {
    event.preventDefault(); // Prevent the actual click
  
    //  const theform = document.getElementById('writeform');
    const theform = formRef.current;

    // Get the form values
    const title = theform.title.value;
    const summary = theform.summary.value;
    const content = theform.content.value;
    const slug = theform.slug.value;
    const tags = theform.tags.value;

    // Check if required fields are empty
    if (!title || !summary || !content || !slug) {
      setAlertVariation('error');
      setAlertText('Please fill in all required fields.');
      setShowAlert(true);

      // Scroll to the top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });

      return;
    }
  
    try {
      const formData = new FormData(theform);
      const resetForm = () => {
        theform.reset();
        SetSlugText('');
      };

      // Convert FormData to a plain JavaScript object
      const formDataObject = Object.fromEntries(formData.entries());
    
      // Convert the object to JSON
      const jsonData = JSON.stringify(formDataObject);

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsonData
      });

      if (response.ok) {
        setAlertVariation('success');
        setAlertText('Data successfully written');
        resetForm();

        setShowAlert(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        return undefined;
      }

      console.log(response.body.toString());

      const errorData = await response.json(); // Parse the error response body as JSON
      throw new Error(errorData.message || 'An error occurred');
    } catch (e) {
      console.log(e);
      setAlertVariation('error');
      setAlertText(e.toString());
    }

    setShowAlert(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return undefined;
  }

  return (
    <>
      <h1>Write a blog post</h1>
      { showAlert && <Alert
        variation={alertVariation}
        isDismissible={true}
        onDismiss={() => setShowAlert(false)}
        hasIcon={true}
        heading=""
        style={{ marginBottom: 1 + 'rem' }}
      >
        {alertText}
      </Alert> }
      <form id="writeform" ref={formRef}>
        <Flex direction="column">
          <Flex direction="column" gap="small">
            <Label htmlFor="title">
                Title
            </Label>
            <Input id="title" name="title" size="large"
                    isRequired onChange={(e) => handleTitleChange(e.target.value)}/>
          </Flex>

          <Flex direction="column" gap="small">
            <TextAreaField placeholder="Enter article summary" isRequired
                          label="Summary" name="summary" id="summary" rows={3} />
          </Flex>
          
          <Flex direction="column" gap="small">
            <TextAreaField placeholder="Write your content in Markdown format" isRequired
                          label="Content" name="content" id="content" rows={10} />
          </Flex>

          <Flex direction="column" gap="small">
            <Label htmlFor="slug">
                Slug
            </Label>
            <Input id="slug" name="slug" size="large" isRequired 
            placeholder="this-is-an-example-of-slug" value={slugText}
            onChange={(e) => SetSlugText(e.target.value)} />
          </Flex>

          <Flex direction="column" gap="small">
            <Label htmlFor="tags">
                Tags
            </Label>
            <Input id="tags" name="tags" size="large" placeholder="Comma separated" />
          </Flex>

          <Button isFullWidth={true} variation="primary" onClick={writeBlogPost}>
            Save
          </Button>
        </Flex>
      </form>
    </>
  );
}

export default Index;

export function getStaticProps() {
  return {
    props: {
      currentPage: '/admin/posts/write'
    }
  }
}