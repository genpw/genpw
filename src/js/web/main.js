import { u } from 'umbrellajs';
import { PasswordGenerator } from '../lib/passwordgenerator';

const pw = new PasswordGenerator();

u('#theBestPassword').text(pw.generate(7));
