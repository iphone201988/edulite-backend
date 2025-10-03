// emailTranslations.ts
export const emailTexts = {
    en: {
      // Verify email
      verifySubject: 'Verify Your Account',
      verifyTitle: 'Email Verification',
      verifyIntro:
        'Thank you for registering with us! To complete your registration and verify your email address, please use the OTP below:',
      verifyExpiry:
        'This OTP will expire in 10 minutes. If you did not request this verification, please ignore this email.',
  
      // Forgot password
      forgotSubject: 'Password Reset',
      forgotTitle: 'Password Reset Request',
      forgotIntro:
        'We received a request to reset your password. Please use the following one-time password (OTP) to complete the process.',
      forgotExpiry:
        'This OTP will expire in 5 minutes. If you did not request a password reset, please disregard this email.',
  
      // Update email
      updateSubject: 'Email Address Update Verification',
      updateTitle: 'Email Address Update Verification',
      updateIntro:
        'We received a request to update your email address. To verify the change, please use the OTP below:',
      updateExpiry:
        'This OTP will expire in 10 minutes. If you did not request this update, please ignore this email.',
  
      // Success/error pages
      successTitle: 'Account Verified!',
      successBody:
        'Congratulations! Your account has been successfully verified. You can now access all features of the platform.',
      errorTitle: 'Verification Link Expired',
      errorBody:
        'Oops, your verification link has expired. Please request a new link to verify your account.',
  
      footer: 'All rights reserved.',
      
      

    },

    fr: {
      // Verify email
      verifySubject: "Vérifiez votre compte",
      verifyTitle: "Vérification de l'e-mail",
      verifyIntro:
        "Merci de vous être inscrit(e) chez nous ! Pour compléter votre inscription et vérifier votre adresse e-mail, veuillez utiliser le code OTP ci-dessous :",
      verifyExpiry:
        "Ce code OTP expirera dans 10 minutes. Si vous n'avez pas demandé cette vérification, veuillez ignorer cet e-mail.",
    
      // Forgot password
      forgotSubject: "Réinitialisation du mot de passe",
      forgotTitle: "Demande de réinitialisation du mot de passe",
      forgotIntro:
        "Nous avons reçu une demande pour réinitialiser votre mot de passe. Veuillez utiliser le code OTP suivant pour compléter le processus.",
      forgotExpiry:
        "Ce code OTP expirera dans 5 minutes. Si vous n'avez pas demandé de réinitialisation du mot de passe, veuillez ignorer cet e-mail.",
    
      // Update email
      updateSubject: "Vérification de la mise à jour de l'adresse e-mail",
      updateTitle: "Vérification de la mise à jour de l'adresse e-mail",
      updateIntro:
        "Nous avons reçu une demande pour mettre à jour votre adresse e-mail. Pour vérifier ce changement, veuillez utiliser le code OTP ci-dessous :",
      updateExpiry:
        "Ce code OTP expirera dans 10 minutes. Si vous n'avez pas demandé cette mise à jour, veuillez ignorer cet e-mail.",
    
      // Success/error pages
      successTitle: "Compte vérifié !",
      successBody:
        "Félicitations ! Votre compte a été vérifié avec succès. Vous pouvez maintenant accéder à toutes les fonctionnalités de la plateforme.",
      errorTitle: "Lien de vérification expiré",
      errorBody:
        "Oups, votre lien de vérification a expiré. Veuillez demander un nouveau lien pour vérifier votre compte.",
    
      footer: "Tous droits réservés.",
    },
  
    ar: {
      // Verify email
      verifySubject: "تحقق من حسابك",
      verifyTitle: "التحقق من البريد الإلكتروني",
      verifyIntro:
        "شكرًا لتسجيلك معنا! لإكمال تسجيلك والتحقق من عنوان بريدك الإلكتروني، يرجى استخدام رمز OTP أدناه:",
      verifyExpiry:
        "سينتهي صلاحية هذا الرمز خلال 10 دقائق. إذا لم تطلب هذا التحقق، يرجى تجاهل هذا البريد الإلكتروني.",
    
      // Forgot password
      forgotSubject: "إعادة تعيين كلمة المرور",
      forgotTitle: "طلب إعادة تعيين كلمة المرور",
      forgotIntro:
        "لقد تلقينا طلبًا لإعادة تعيين كلمة المرور الخاصة بك. يرجى استخدام رمز OTP التالي لإكمال العملية.",
      forgotExpiry:
        "سينتهي صلاحية هذا الرمز خلال 5 دقائق. إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد الإلكتروني.",
    
      // Update email
      updateSubject: "التحقق من تحديث عنوان البريد الإلكتروني",
      updateTitle: "التحقق من تحديث عنوان البريد الإلكتروني",
      updateIntro:
        "لقد تلقينا طلبًا لتحديث عنوان بريدك الإلكتروني. للتحقق من هذا التغيير، يرجى استخدام رمز OTP أدناه:",
      updateExpiry:
        "سينتهي صلاحية هذا الرمز خلال 10 دقائق. إذا لم تطلب هذا التحديث، يرجى تجاهل هذا البريد الإلكتروني.",
    
      // Success/error pages
      successTitle: "تم التحقق من الحساب!",
      successBody:
        "تهانينا! تم التحقق من حسابك بنجاح. يمكنك الآن الوصول إلى جميع ميزات المنصة.",
      errorTitle: "انتهت صلاحية رابط التحقق",
      errorBody:
        "عذرًا، لقد انتهت صلاحية رابط التحقق الخاص بك. يرجى طلب رابط جديد للتحقق من حسابك.",
    
      footer: "جميع الحقوق محفوظة.",
    },
  } as const;
  
  export type Lang = keyof typeof emailTexts;
  