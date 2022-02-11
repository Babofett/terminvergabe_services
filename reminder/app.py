import requests
import json
import smtplib

from os import environ
import time


def run():
    while True:
        try:
            appmts = _get_appmts()
            for appmt in appmts:
                user = _get_user(appmt['userId'])
                try:
                    merchant = _get_merchant(appmt['merchantId'])
                    _send_mail(user['email'], user['name'], appmt['startTime'], merchant["name"])
                except Exception:
                    print("Couldn't fetch merchant")
                    _send_mail(user['email'], user['name'], appmt['startTime'])
        except Exception:
            print("Skipped interval")
        time.sleep(int(environ["LOOKUP_INTERVAL"]))


def _get_appmts():
    try:
        res = requests.get(f"http://{environ['APPOINTMENT_HOST']}:{environ['APPOINTMENT_PORT']}/appointments")

        curr_time = time.time()
        one_hour_interval_start = curr_time + 60 * 60 - int(environ["LOOKUP_INTERVAL"])
        one_hour_interval_end = curr_time + 60 * 60

        if res.status_code == 200:
            appmt_ls = res.json()
            reminds = list(filter(lambda appmt: one_hour_interval_start <= appmt["startAsTimestamp"] < one_hour_interval_end, appmt_ls))
            print(f"[REMINDER][lookup] currTime: {curr_time:.0f} - interval = [{one_hour_interval_start:.0f} to {one_hour_interval_end:.0f}] => {len(reminds)} appointments will be reminded")
            return reminds

    except requests.exceptions.ConnectionError:
        print("failed!")


def _get_user(user_id):
    try:
        res = requests.get(f"http://{environ['USER_HOST']}:{environ['USER_PORT']}/users/{user_id}")
        if res.status_code == 200:
            return res.json()
    except requests.exceptions.ConnectionError:
        print("failed!")


def _get_merchant(merchant_id):
    try:
        res = requests.get(f"http://{environ['MERCHANT_HOST']}:{environ['MERCHANT_PORT']}/merchants/{merchant_id}")
        if res.status_code == 200:
            return res.json()
    except requests.exceptions.ConnectionError:
        print("failed!")


def _send_mail(user_email, user_name, due_at, destination="Basilico"):
    sent_from = environ['MAIL_USER']
    to = user_email
    # ['joshua.fett@mni.thm.de']
    subject = f'Reminder: Your booked appointment at {destination}'
    body = f'Hello {user_name},\n\nThis is a reminder, that your booked appointement at {destination} will be due in 1 hour at {due_at}!\n\nBest Regards,\nTerminService MSE'

    email_text = f"""\
From: {sent_from}
To: {to}
Subject: {subject}

{body}
"""

    try:
        smtp_server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        smtp_server.ehlo()
        smtp_server.login(sent_from, environ['MAIL_KEY'])
        smtp_server.sendmail(sent_from, to, email_text)
        smtp_server.close()
        print("Email sent successfully!")
    except Exception as ex:
        print("Something went wrong….", ex)


if __name__ == "__main__":
    print("[REMINDER][main] Started")
    run()
