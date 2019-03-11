<?php 
header("Access-Control-Allow-Origin: *");

require 'vendor/autoload.php';

$errors = array();
$regex = array(
  'email' => '/^(?!(?:(?:\x22?\x5C[\x00-\x7E]\x22?)|(?:\x22?[^\x5C\x22]\x22?)){255,})(?!(?:(?:\x22?\x5C[\x00-\x7E]\x22?)|(?:\x22?[^\x5C\x22]\x22?)){65,}@)(?:(?:[\x21\x23-\x27\x2A\x2B\x2D\x2F-\x39\x3D\x3F\x5E-\x7E]+)|(?:\x22(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|(?:\x5C[\x00-\x7F]))*\x22))(?:\.(?:(?:[\x21\x23-\x27\x2A\x2B\x2D\x2F-\x39\x3D\x3F\x5E-\x7E]+)|(?:\x22(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|(?:\x5C[\x00-\x7F]))*\x22)))*@(?:(?:(?!.*[^.]{64,})(?:(?:(?:xn--)?[a-z0-9]+(?:-[a-z0-9]+)*\.){1,126}){1,}(?:(?:[a-z][a-z0-9]*)|(?:(?:xn--)[a-z0-9]+))(?:-[a-z0-9]+)*)|(?:\[(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){7})|(?:(?!(?:.*[a-f0-9][:\]]){7,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?)))|(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){5}:)|(?:(?!(?:.*[a-f0-9]:){5,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3}:)?)))?(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))(?:\.(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))){3}))\]))$/iD',
  'phone' => '/^(?:(?:\(?(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?(?:\(?0\)?[\s-]?)?)|(?:\(?0))(?:(?:\d{5}\)?[\s-]?\d{4,5})|(?:\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3}))|(?:\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4})|(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}))(?:[\s-]?(?:x|ext\.?|#)\d{3,4})?$/'
);

$contents = file_get_contents("php://input");
$_POST = json_decode($contents, true);

$input = array(
  "name" => filter_var($_POST["name"], FILTER_SANITIZE_STRING),
  "email" => filter_var($_POST["email"], FILTER_SANITIZE_STRING),
  "phone" => filter_var($_POST["phone"], FILTER_SANITIZE_STRING),
  "message" => filter_var($_POST["message"], FILTER_SANITIZE_STRING),
  "website" => filter_var($_POST["website"], FILTER_SANITIZE_STRING)
);

function pushError($name, $message, &$errors) {
  $error = array(
    'field' => $name,
    'message' => $message
  );

  array_push($errors, $error);
}

if($input["website"]) {
  $result = array(
    'result' => 'error',
    'errors' => array(
      array(
        'message' => 'This looks like spam'
      )
    )
  );

  http_response_code(500);
  header("Content-Type: application/json");

  echo json_encode($result);
  die();
}

if(empty($input["name"])) {
  pushError('name', 'Name is required', $errors);
}

if(empty($input["email"]) && empty($input["phone"])) {
  pushError('contact', 'Email or phone required', $errors);
}

if(!empty($input["email"]) && !preg_match($regex['email'], $input["email"])) {
  pushError('email', 'Email is invalid', $errors);
}

if(!empty($input["phone"]) && !preg_match($regex['phone'], $input["phone"])) {
  pushError('phone', 'Phone is invalid', $errors);
}

if(empty($input["message"])) {
  pushError('message', 'Message is required', $errors);
}

if(sizeof($errors)>0) {
  $result = array(
    'result' => 'error',
    'errors' =>  $errors
  );

  http_response_code(400);
  header("Content-Type: application/json");

  echo json_encode($result);
} else {
  $email = new \SendGrid\Mail\Mail(); 
  $email->setFrom("info@odpt.co.uk", "ODPT.co.uk");
  $email->setSubject("ODPT Online Enquiry");
  
  if(!empty($input["email"])) {
    $email->setReplyTo($input["email"], $input["name"]);
  }
  
  $email->addTo("oli@odpt.co.uk", "Oli Dickinson");
  
  $content = $input["name"] . "<br> ";
  
  if(!empty($input["email"])) {
    $content .= $input["email"] . "<br> ";
  }
  
  if(!empty($input["phone"])) {
    $content .= $input["phone"] . "<br> ";
  }
  
  $content .= "<br>" . nl2br($input["message"]);
  
  $email->addContent("text/html", $content);
  
  $sendgrid = new \SendGrid('SENDGRID_API_KEY');
  
  try {
      $response = $sendgrid->send($email);

      http_response_code($response->statusCode());
      header("Content-Type: application/json");

      $result = array(
        'result' => 'success'
      );

      if($response->statusCode() != 202) {
        $result['result'] = 'error';
        $result['errors'] = json_decode($response->body())->errors;
      }

      echo json_encode($result);
  } catch (Exception $e) {
      $result = array(
        'result' => 'error',
        'errors' => array(
          array(
            'message' => $e->getMessage()
          )
        )
      );

      http_response_code(500);
      header("Content-Type: application/json");

      echo json_encode($result);
  }
}