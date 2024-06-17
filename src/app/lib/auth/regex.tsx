export const regexName =
	/^(?!.*[^a-zA-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÑÒÓÔÕÖØŒÙÚÛÜíîàáâãäåæçèéêëïñòóôõöøœùúûü]|"|').{1,30}$/ // regex for name

export const regexPassword =
	// il faut au moins 10 caractères, 1 minuscule, 1 majuscule, 1 chiffre et 1 caractère spécial et ne doit pas dépasser 30 caractères
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*?.-_éèàïäüùç])[a-zA-Z0-9!@#$%^&*?.-_éèàïäüùç]{10,30}$/ //empeche les caractère !@#$%^&*.
export const regexEmail =
	/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
