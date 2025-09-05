<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends Notification
{
    public $url;

    /**
     * Kreira novu notifikaciju za reset lozinke.
     *
     * @param string $token
     * @param string $email
     */
    public function __construct($token, $email)
    {
        // Link koji ide na frontend sa tokenom i email-om
        $this->url = config('app.frontend_url') . '/reset-password?token=' . $token . '&email=' . urlencode($email);
    }

    /**
     * Kanali preko kojih se šalje notifikacija.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Mail poruka koja se šalje korisniku.
     *
     * @param mixed $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Password Reset Request')
            ->line('You requested a password reset.')
            ->action('Reset Password', $this->url)
            ->line('If you did not request this, no further action is required.');
    }
}
