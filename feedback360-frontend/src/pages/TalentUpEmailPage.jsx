import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './TalentUpEmail.css';

/**
 * ============================================================================
 * PAGE : TalentUpEmailPage (Page Email de Fin de Formation)
 * ============================================================================
 * Rôle : Page affichée après qu'un participant clique sur le lien "OK"
 *        dans l'email reçu de TalentUp/Feedback360.
 * 
 * Fonctionnalités clés :
 * - Affiche un récapitulatif de la formation terminée.
 * - Bouton "OK" : redirige vers le dashboard participant si authentifié,
 *   sinon vers la page de connexion (qui redirigera ensuite vers le dashboard).
 * ============================================================================
 */
const TalentUpEmailPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleClick = () => {
    // Si l'utilisateur est déjà connecté → dashboard participant
    // Sinon → page de connexion (redirigera vers le dashboard après login)
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
            🎓 <span>TALENTUP</span>
          </div>
        </div>

        <div className="email-body">
          <h2>
            Votre formation est terminée <span>✅</span>
          </h2>

          <div className="formation-box">
            <p>
              <strong>Formation :</strong> Angular Fundamentals
            </p>
            <p>
              <strong>Date :</strong> 10/07/2026
            </p>
          </div>

          <p className="message">
            Votre avis nous intéresse.
          </p>

          <p className="message">
            Merci de compléter votre évaluation afin d'améliorer la qualité de nos formations.
          </p>

          <button className="btn-feedback" onClick={handleClick}>
            OK
          </button>
        </div>

        <div className="email-footer">
          Équipe TalentUp & Feedback360
        </div>
      </div>
    </div>
  );
};

export default TalentUpEmailPage;
export { TalentUpEmailPage };