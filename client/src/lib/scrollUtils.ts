


export const scrollToSectionWithOffset = (sectionId: string, behavior: 'smooth' | 'auto' = 'smooth') => {
   
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      const navbar = document.querySelector('nav'); 
  
      if (element) {
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navbarHeight;
  
        window.scrollTo({
          top: offsetPosition,
          behavior: behavior
        });
      }
    }, 100); 
  };