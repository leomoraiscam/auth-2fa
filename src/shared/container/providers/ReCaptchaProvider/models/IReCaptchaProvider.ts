interface IReCaptchaProvider {
  validate(token: string): Promise<boolean>;
}

export default IReCaptchaProvider;
