from django.core.mail import EmailMessage
import logging
import threading


class EmailThread(threading.Thread):

    def __init__(self, email):
        self.email = email
        threading.Thread.__init__(self)

    def run(self):
        try:
            self.email.send()
            logging.warning(f"Email sent to {self.email.to}")
        except Exception as e:
            logging.warning(f"Failed to send email to {self.email.to}: {e}")
            
class HelperClass:
    @staticmethod
    def send_email(data):
        email = EmailMessage(
            subject=data['email_subject'], body=data['email_body'], to=data['to_emails'])
        email.content_subtype = "html"
        EmailThread(email).start()