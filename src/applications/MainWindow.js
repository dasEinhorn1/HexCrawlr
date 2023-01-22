class HexLabeller extends FormApplication {
    constructor(object, options) {
        super(object, options);
    }
  
    static get defaultOptions() {
        return super.defaultOptions;
    }
  
    getData(options = {}) {
        return super.getData().object; // the object from the constructor is where we are storing the data
    }
  
    activateListeners(html) {
       super.activateListeners(html);
    }
  
    async _updateObject(event, formData) {
        return;
    }
}



export function showForm(template, data) {
    const form = new HexLabeller(data, { template })
    form.render(true);
}
  