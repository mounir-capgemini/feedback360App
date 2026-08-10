import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './TalentUpEmail.css';

/**
 * ============================================================================
 * PAGE : TalentUpEmailPage (Page Email de Fin de Formation)
 * ============================================================================
 * Rôle : Page affichée après qu'un participant clique sur le lien
 *        dans l'email d'invitation TalentUp/Feedback360.
 *
 * Fonctionnalités clés :
 * - Affiche un récapitulatif de la création du compte.
 * - Affiche les informations de connexion (email + mot de passe par défaut).
 * - Bouton "Accéder à mon compte" : redirige vers le dashboard si authentifié,
 *   sinon vers la page de connexion.
 * ============================================================================
 */
const TalentUpEmailPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const userEmail = searchParams.get('email');

  const DEFAULT_PASSWORD = 'TalentUp2024!';

  const handleClick = () => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/login', {
        replace: true,
        state: { from: { pathname: '/dashboard' } },
      });
    }
  };

  return (
    <div className="email-page">
      <div className="email-card">
        <div className="email-header">
          <div className="logo">
            🎓 <span>FEEDBACK360</span>
          </div>
        </div>

        <div className="email-body">
          <h2>Bonjour,</h2>

          <p className="message">
            Un compte Feedback360 vient d'être créé pour vous.
          </p>

          <p className="message">
            Pour vous connecter, utilisez les informations suivantes&nbsp;:
          </p>

          <div className="formation-box">
            <p>
              <strong>Email :</strong> {userEmail || 'Votre adresse email TalentUp'}
            </p>
            <p>
              <strong>Mot de passe :</strong> {DEFAULT_PASSWORD}
            </p>
          </div>

          <button className="btn-feedback" onClick={handleClick}>
            Accéder à mon compte
          </button>

          <div className="message email-note">
            Ce lien est valable pendant 24 heures.
          </div>
        </div>

        <div className="email-footer">
          Équipe Feedback360
        </div>
      </div>
    </div>
  );
};

export default TalentUpEmailPage;
export { TalentUpEmailPage };