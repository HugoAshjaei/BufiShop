import { Config } from '../models';
import { IConfig } from '../intefaces';

if (!global.CONFIG) {
    global.CONFIG = {
        firstTimeUsage: true,
        website: undefined!
    }
}
Config.findOne({}).sort('-created_at').exec().then((config) => {
    if (!config) {
        global.CONFIG.firstTimeUsage = true;
    } else {
        global.CONFIG.firstTimeUsage = false;
        global.CONFIG.website = config;
    }
});


export async function updateConfig(config: any) {
    await loadConfig();
    if (!global.CONFIG.website) {
        global.CONFIG.website = await new Config(config).save();
    } else {
        global.CONFIG.firstTimeUsage = false;
        global.CONFIG.website = await Config.findByIdAndUpdate(global.CONFIG.website._id, config, { new: true }) as IConfig;
    }  
    return global.CONFIG!;
}

export async function loadConfig() {
    if (!global.CONFIG.website) {
        await Config.findOne({}).sort('-created_at').exec().then((config) => {
            if (!config) {
                global.CONFIG.firstTimeUsage = true;
            } else {
                global.CONFIG.firstTimeUsage = false;
                global.CONFIG.website = config;
            }
        });
    }
    return global.CONFIG;
}