export const successMessages = {
    en: {
        EMAIL_VERIFIED: "Email verified successfully. You can now log in to your account.",
        OTP_VERIFIED: "OTP verified successfully. You can now reset your password.",
        EMAIL_ALREADY_VERIFIED: "This email address has already been verified. You can log in to your account.",
        OTP_SENT: "OTP sent to your email. Please verify your account.",
        USER_REGISTERED: "User registered successfully",
        USER_LOGIN: "User logged in successfully",
        PROFILE_UPDATED: "Profile updated successfully",
        LOGIN_SUCCESS: "Login successful",
        DOCUMENT_ALREADY_UPLOADED: "Document already uploaded.",
        DOCUMENT_UPLOADED_SUCCESS: "Document uploaded successfully.",
        AVAILABILITYUPDATED: "Price and availability details updated successfully.",
        NURSES_FETCHED: "Nurses fetched successfully",
        PASSWORD_CHANGED: "Password changed successfully.",
        OTPSENTFORPASSWORDRESET: "OTP sent to your email for password reset",
        USER_STATUS_CHANGED: "User status changed.",
        NURSE_STATUS_CHANGED: "Nurse status changed.",
        USER_LOGOUT_SUCCESS: "User logged out successfully.",
        USER_DELETED_SUCCESS: "User deleted successfully.",
    },
    fr: {
        USER_LOGOUT_SUCCESS: "Utilisateur déconnecté avec succès.",
        USER_DELETED_SUCCESS: "Utilisateur supprimé avec succès.",
        EMAIL_VERIFIED: "E-mail vérifié avec succès. Vous pouvez maintenant vous connecter à votre compte.",
        OTP_VERIFIED: "OTP vérifié avec succès. Vous pouvez maintenant réinitialiser votre mot de passe.",
        EMAIL_ALREADY_VERIFIED: "Cette adresse e-mail a déjà été vérifiée. Vous pouvez vous connecter à votre compte.",
        OTP_SENT: "OTP envoyé à votre e-mail. Veuillez vérifier votre compte.",
        USER_REGISTERED: "Utilisateur enregistré avec succès",
        USER_LOGIN: "Utilisateur connecté avec succès",
        PROFILE_UPDATED: "Profil mis à jour avec succès",
        LOGIN_SUCCESS: "Connexion réussie",
        DOCUMENT_ALREADY_UPLOADED: "Document déjà téléchargé.",
        DOCUMENT_UPLOADED_SUCCESS: "Document téléchargé avec succès.",
        AVAILABILITYUPDATED: "Les détails du prix et de la disponibilité ont été mis à jour avec succès.",
        NURSES_FETCHED: "Infirmières récupérées avec succès",
        PASSWORD_CHANGED: "Mot de passe modifié avec succès.",
        OTPSENTFORPASSWORDRESET: "OTP envoyé à votre e-mail pour la réinitialisation du mot de passe",
        USER_STATUS_CHANGED: "Statut de l'utilisateur modifié.",
        NURSE_STATUS_CHANGED: "Statut de l'infirmière modifié.",
    },
    ar: {
        USER_LOGOUT_SUCCESS: "تم تسجيل خروج المستخدم بنجاح.",
        USER_DELETED_SUCCESS: "تم حذف المستخدم بنجاح.",
        EMAIL_VERIFIED: "تم التحقق من البريد الإلكتروني بنجاح. يمكنك الآن تسجيل الدخول إلى حسابك.",
        OTP_VERIFIED: "تم التحقق من رمز OTP بنجاح. يمكنك الآن إعادة تعيين كلمة المرور الخاصة بك.",
        EMAIL_ALREADY_VERIFIED: "تم التحقق من عنوان البريد الإلكتروني هذا مسبقًا. يمكنك تسجيل الدخول إلى حسابك.",
        OTP_SENT: "تم إرسال رمز OTP إلى بريدك الإلكتروني. يرجى التحقق من حسابك.",
        USER_REGISTERED: "تم تسجيل المستخدم بنجاح",
        USER_LOGIN: "تم تسجيل دخول المستخدم بنجاح",
        PROFILE_UPDATED: "تم تحديث الملف الشخصي بنجاح",
        LOGIN_SUCCESS: "تم تسجيل الدخول بنجاح",
        DOCUMENT_ALREADY_UPLOADED: "تم تحميل المستند بالفعل.",
        DOCUMENT_UPLOADED_SUCCESS: "تم تحميل المستند بنجاح.",
        AVAILABILITYUPDATED: "تم تحديث تفاصيل السعر والتوافر بنجاح.",
        NURSES_FETCHED: "تم استرجاع الممرضات بنجاح",
        PASSWORD_CHANGED: "تم تغيير كلمة المرور بنجاح.",
        OTPSENTFORPASSWORDRESET: "تم إرسال رمز OTP إلى بريدك الإلكتروني لإعادة تعيين كلمة المرور",
        USER_STATUS_CHANGED: "تم تغيير حالة المستخدم.",
        NURSE_STATUS_CHANGED: "تم تغيير حالة الممرضة.",
    }

} as const;

export type Language = keyof typeof successMessages;
export type SuccessKey = keyof typeof successMessages[Language];

export function getSuccessMessage(
    key: SuccessKey,
    lang: Language = "en"
): string {
    return successMessages[lang][key];
}