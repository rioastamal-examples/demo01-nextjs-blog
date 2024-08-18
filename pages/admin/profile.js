import { useAuthenticator, Input, Label, Flex, Button, Alert, TextAreaField } from '@aws-amplify/ui-react';
import React, { useEffect, useState } from 'react';
import slugify from '../../libs/slugify';
import Head from 'next/head';
import { generateClient } from 'aws-amplify/data';

function Index() {
  const { authStatus, user } = useAuthenticator(context => [context.authStatus, context.user]);
  console.log('user =>', user);

  const [alertVariation, setAlertVariation] = useState('success');
  const [alertText, setAlertText] = useState('Data successfully written');
  const [showAlert, setShowAlert] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [profileData, setProfileData] = useState({
    fullname: '',
    profile: '',
    subdomain: ''
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfileData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const formRef = React.useRef(null);

  const loadCurrentProfile = async function() {
    const client = generateClient();
    try {
      const { data, errors} = await client.models.User.get({
        userId: user.userId
      }, { authMode: 'userPool' });
      console.log('data current profile =>', data);
      setProfileData({
        fullname: data.name ?? '',
        profile: data.profile ?? '',
        subdomain: data.subdomain ?? ''
      })
    } catch (err) {
      console.log('Fetch current profile error =>', error);
    }
  }

  useEffect(() => {
    if (authStatus === 'configuring') {
      return;
    }

    if (authStatus === 'unauthenticated') {
      console.log('redirecting to /login');
      window.location.href = '/login';
      return;
    }

    if (authStatus === 'authenticated') {
      setUserEmail(user.signInDetails.loginId);
      loadCurrentProfile();
    }

  }, [authStatus]);

  const writeProfile = async function(event) {
    event.preventDefault(); // Prevent the actual click
  
    //  const theform = document.getElementById('writeform');
    const theform = formRef.current;

    // Get the form values
    const fullname = theform.fullname.value;
    const subdomain = theform.subdomain.value;
    const profile = theform.profile.value;

    // Check if required fields are empty
    if (!fullname || !subdomain || !profile) {
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
      };

      // Convert FormData to a plain JavaScript object
      const formDataObject = Object.fromEntries(formData.entries());
    
      // Convert the object to JSON
      const jsonData = JSON.stringify(formDataObject);

      const response = await fetch('/api/users', {
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
    <Head>
      <title>My profile</title>
    </Head>

      <h1>My profile</h1>
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
            <Label htmlFor="email">
                Email
            </Label>
            <Input size="large" value={userEmail} disabled/>
          </Flex>

          <Flex direction="column" gap="small">
            <Label htmlFor="fullname">
                Full name
            </Label>
            <Input id="fullname" name="fullname" size="large" 
            value={profileData.fullname} 
            onChange={handleInputChange}/>
          </Flex>

          <Flex direction="column" gap="small">
            <Label htmlFor="subdomain">
                Blog subdomain name
            </Label>
            <Input id="subdomain" name="subdomain" size="large" 
              value={profileData.subdomain} 
              onChange={handleInputChange}/>
          </Flex>
          
          <Flex direction="column" gap="small">
            <TextAreaField placeholder="Write your profile in Markdown" isRequired
                          label="Profile" name="profile" id="profile" rows={10} 
                          value={profileData.profile}
                          onChange={handleInputChange} />
          </Flex>

          <Button isFullWidth={true} variation="primary" onClick={writeProfile}>
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
      currentPage: '/admin/profile'
    }
  }
}