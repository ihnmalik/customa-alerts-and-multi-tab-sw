



export async function promptForUpdate() {
    return new Promise((resolve) => {
      // Create a modal dialog that will prompt the user to update.
      const modal = document.createElement('div');
      modal.style.position = 'fixed';
      modal.style.top = '50%';
      modal.style.left = '50%';
      modal.style.transform = 'translate(-50%, -50%)';
      modal.style.background = 'white';
      modal.style.padding = '20px';
      modal.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
      modal.innerHTML = `
        <h2>A new version of the app is available!</h2>
        <p>Would you like to update now?</p>
        <button id="yes-btn">Yes</button>
        <button id="no-btn">No</button>
      `;
  
      // Add event listeners to the "Yes" and "No" buttons.
      modal.querySelector('#yes-btn')?.addEventListener('click', () => {
        modal.remove();
        resolve(true);
      });
  
      modal.querySelector('#no-btn')?.addEventListener('click', () => {
        modal.remove();
        resolve(false);
      });
  
      // Add the modal to the page.
      document.body.appendChild(modal);
    });
  }