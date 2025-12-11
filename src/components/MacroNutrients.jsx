import React from 'react';

const MacroNutrients = ({ protein, carbs, fats, targets }) => {
  const proteinPercent = Math.min((protein / targets.protein) * 100, 100);
  const carbPercent = Math.min((carbs / targets.carbs) * 100, 100);
  const fatPercent = Math.min((fats / targets.fats) * 100, 100);

  return (
    <div className="macro-card">
      <div className="macro-item">
        <div className="macro-label">Proteins</div>
        <div className="macro-bar">
          <div 
            className="macro-progress protein-progress" 
            style={{ width: `${proteinPercent}%` }}
          ></div>
        </div>
        <div className="macro-count">
          <span>{Math.round(protein)}</span> / <span>{targets.protein}</span>
        </div>
      </div>
      <div className="macro-item">
        <div className="macro-label">Carbs</div>
        <div className="macro-bar">
          <div 
            className="macro-progress carb-progress" 
            style={{ width: `${carbPercent}%` }}
          ></div>
        </div>
        <div className="macro-count">
          <span>{Math.round(carbs)}</span> / <span>{targets.carbs}</span>
        </div>
      </div>
      <div className="macro-item">
        <div className="macro-label">Fats</div>
        <div className="macro-bar">
          <div 
            className="macro-progress fat-progress" 
            style={{ width: `${fatPercent}%` }}
          ></div>
        </div>
        <div className="macro-count">
          <span>{Math.round(fats)}</span> / <span>{targets.fats}</span>
        </div>
      </div>
    </div>
  );
};

export default MacroNutrients;
