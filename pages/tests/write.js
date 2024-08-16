import { useAuthenticator, Input, Label, Flex, Button, Alert } from '@aws-amplify/ui-react';
import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/data';

function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function Index() {
  const { authStatus, user } = useAuthenticator(context => [context.authStatus, context.user]);
  console.log('isObject =>', isObject(user));
  console.log(user);

  let isAuthenticated = authStatus === 'authenticated';

  const [alertVariation, setAlertVariation] = useState('success');
  const [alertText, setAlertText] = useState('Data successfully written');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (authStatus === 'configuring') {
      return;
    }

    if (!isAuthenticated) {
      // window.location.href = '/login';
      console.log('redirecting to /login');
      return null;
    }
  }, [isAuthenticated]);

  const testWriteData = async function(event) {
    event.preventDefault(); // Prevent the actual click
  
    const theform = document.getElementById('writeform');
  
    // Access form values using event.target
    const email = theform.email.value;
    const fullname = theform.fullname.value;
  
    console.log('Email:', email);
    console.log('Full Name:', fullname);
  
    // Perform any additional logic with the form values
    const client = generateClient();
    const userId = 'id-' + new Date().toISOString();
  
    try {
      const {data, errors} = await client.models.User.create({
        userId: userId,
        name: fullname,
        email: email,
      }, {
        authMode: 'userPool'
      });

      if (errors) {
        console.log(errors);
        setAlertText(response.errors[0].message);
        setAlertVariation('error');
        return undefined;
      }
      
      console.log(data);
      setAlertText('Data successfully written');
    } catch (e) {
      console.log(e);
      setAlertVariation('error');
      setAlertText(e.toString());
    }

    setShowAlert(true);
  
    return undefined;
  }

  return (
    <>
      <h1>Write to DB</h1>
      <p>This test will perform write to User database in DynamoDB table.</p>
      <Alert
        variation={alertVariation}
        isDismissible={true}
        hasIcon={true}
        heading=""
        style={{ marginBottom: 1 + 'rem', display: showAlert ? 'flex' : 'none' }}
      >
        {alertText}
      </Alert>
      <form id="writeform">
        <Flex direction="column">
          <Flex direction="column" gap="small">
            <Label htmlFor="email">
                Email
            </Label>
            <Input id="email" name="email" size="large" isRequired />
          </Flex>

          <Flex direction="column" gap="small">
            <Label htmlFor="name">
                Name
            </Label>
            <Input id="fullname" name="fullname" size="large" isRequired />
          </Flex>

          <Button isFullWidth={true} variation="primary" onClick={testWriteData}>
            Save
          </Button>
        </Flex>
      </form>
    </>
  );
}

export default Index;

      {/* <label htmlFor="email">Email:</label>
      <input type="text" id="email" name="email" /><br/>
      <label htmlFor="email">Name:</label>
      <input type="text" id="fullname" name="fullname" /><br/>
      <input type="submit" /> */}