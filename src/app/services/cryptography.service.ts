declare let JSEncrypt: any;
import { Injectable } from "@angular/core";
import { UserService } from './user.service';

@Injectable()
export class CryptographyService {
    encryptor: any;
    private _uuid: string;

    constructor(private _userService: UserService) {
        this.encryptor = new JSEncrypt();
    }

    regeneratePublicKey(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._userService
                .getPublicKey()
                .subscribe(
                    response => {
                        this._uuid = response.data.uuid;
                        this.encryptor.setPublicKey(response.data.public_key);
                        resolve();
                    },
                    error => {
                        console.error('ERROR', error);
                        reject(error);
                    }
                );
        });
    }

    getUuid(): string {
        return this._uuid;
    }

    encrypt(text: string): string {
        return this.encryptor.encrypt(text);
    }
}
